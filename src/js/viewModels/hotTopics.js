/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'jquery','ojs/ojknockout', 'ojs/ojbutton'
, 'ojs/ojmodel', 'ojs/ojchart','ojs/ojinputtext'],
 function(oj, ko, $) {

    function HotTopicsViewModel() {
      var self = this;
      self.pieSeriesValue = ko.observableArray();
      self.pieSeriesValue2 = ko.observableArray();
      self.valueToSearch =ko.observable('Oracle');
      self.getSearch = ()=>{
        $.ajax({
          type: "GET",
          url: `http://localhost:8080/groups/getAll?group=${self.valueToSearch()}`,
          success: (data) => {
            let converted = ko.observableArray();
            data.forEach((value) =>{
              converted().push({
                name: `${value.group}`,
                items: [value.total]
              })
            });
            self.pieSeriesValue2(converted())
          },
          failure: function(jqXHR, textStatus, errorThrown) {
          }
        });
      }
      function review(key) {
        if(key.key === 'Enter'){
          self.getSearch();
        }
      }
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
        $.ajax({
          type: "GET",
          url: "http://localhost:8080/groups/getAll",
          success: (data) => {
            let converted = ko.observableArray();
            data.forEach((value) =>{
              converted().push({
                name: `${value.group}`,
                items: [value.total]
              })
            });
            self.pieSeriesValue(converted())
          },
          failure: function(jqXHR, textStatus, errorThrown) {
          }
        });
        self.getSearch();
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
        let element = document.getElementById('input');
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
        // Implement if needed
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
    return new HotTopicsViewModel();
  }

);
