/**
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'socket.io', 'jquery', 'Noty', 'appController',
 'ojs/ojbutton','ojs/ojavatar',
'ojs/ojcollectiontabledatasource', 'ojs/ojmodel', 'ojs/ojlistview',
'ojs/ojinputtext', 'ojs/ojlabel'],
 function(oj, ko, io, $, Noty, app) {

    function DashboardViewModel() {
      var self = this;
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      self.dataSource = ko.observable();
      self.dataSourceGroups = ko.observable();
      self.value = ko.observable();
      self.limit = 100;
      self.valueMsg = ko.observable('');
      var socket = io.connect("http://localhost:3000");
      socket.on('connect', function() {
        console.log('Socket connected: ', socket.connected);
      });

      socket.on("send_new", function (data) {
        new Noty({
          text: 'New tag created',
          type: 'success',
          theme: 'mint',
          maxVisible: 4,
          timeout: 5000,
          theme: 'mint'
        }).show();

        grpColl.refresh();
        self.dataSourceGroups(new oj.CollectionTableDataSource(grpColl));
      })
      socket.on("send_task", function (data) {
        const element = document.getElementById('container-not');
        const childs = element.childNodes.length;
        if(childs === 0){
        let n = new Noty({
          type: 'info',
          theme: 'mint',
          container: '#container-not',
          buttons: [
            Noty.button('New message click here to refresh', 'refresh-btn', function () {
              msgColl.refresh();
              self.dataSource(new oj.CollectionTableDataSource(msgColl));
              n.close();
              element.innerHTML ='';
            }),
          ]

        });
        n.show();
        }
        grpColl.refresh();
        self.dataSourceGroups(new oj.CollectionTableDataSource(grpColl));
      })
      //Used to generate the REST URL to include the search criteria
      self.searchURLMsg = ko.computed(function() {
        return "http://localhost:8080/message" +
        '?value=' + self.value();
      });
      const Message = oj.Model.extend({
        idAttribute: "id",
        parse: (data)=>{
          return{
            initials:data.user.split('@')[1].charAt(0),
            user: data.user,
            userUrl: data.user.replace(/(\S*)/g,'<a href="#">$1</a>'),
            content: data.content.replace(/#(\S*)/g,'<a href="#">#$1</a>')
          }
        }
      });

      const Messages = oj.Collection.extend({
        url: "http://localhost:8080/messages",
        model: Message,
        parse: function(msgs) {
          return msgs;
        }
      });

      let msgColl = new Messages();

      const Group = oj.Model.extend({
        idAttribute: "id"
      });

      const Groups = oj.Collection.extend({
        url: "http://localhost:8080/groups/getTop5",
        model: Group,
        parse: function(grps) {
          return grps;
        }
      });

      let grpColl = new Groups();
      self.chars = ko.observable(self.limit);
      self.isOverTop = ko.computed(()=>{
        return self.chars() <= 0;
      });
      function review(key) {
        const listOfText = document.getElementsByTagName('textarea');
        const element = listOfText[0];
        if(!element.getAttribute('maxlength')){
          element.setAttribute('maxlength',self.limit)
        }
        let totalUsed = element.value.length;
        self.chars(totalUsed === 0 ? self.limit:self.limit-totalUsed);
        if(key.key === 'Enter'){
          self.valueMsg(self.valueMsg().replace(/\n|\r/g, ""))
          self.sendEvent();
        }

      }
      self.sendEvent = function(event) {
        let msgEncoded = encodeURI(self.valueMsg());
        msgEncoded = msgEncoded.replace(/#/g, '%23');
        self.valueMsg('');
        self.chars(self.limit);
        const promise = $.ajax({
          type: "POST",
          url: `http://localhost:8080/message?value=${msgEncoded}&user=@${app.userLogin()}`,
          success: () => {
            msgColl.fetch();
          },
          failure: function(jqXHR, textStatus, errorThrown) {
          }
        });
      }

      // Below are a subset of the ViewModel methods invoked by the ojModule binding
      // Please reference the ojModule jsDoc for additional available methods.

      /**
       * Optional ViewModel method invoked when this ViewModel is about to be
       * used for the View transition.  The application can put data fetch logic
       * here that can return a Promise which will delay the handleAttached function
       * call below until the Promise is resolved.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
       * the promise is resolved
       */
      self.handleActivated = function(info) {
        // Implement if needed
        msgColl.fetch();
        self.dataSource(new oj.CollectionTableDataSource(msgColl));
        self.dataSourceGroups(new oj.CollectionTableDataSource(grpColl));
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
       */
      self.handleAttached = function(info) {
        let element = document.getElementById('text-area');
        element.addEventListener('keyup',review);

      };


      /**
       * Optional ViewModel method invoked after the bindings are applied on this View.
       * If the current View is retrieved from cache, the bindings will not be re-applied
       * and this callback will not be invoked.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       */
      self.handleBindingsApplied = function(info) {

      };

      /*
       * Optional ViewModel method invoked after the View is removed from the
       * document DOM.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
       */
      self.handleDetached = function(info) {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
