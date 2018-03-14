(function(window) {
  "use strict";
  var App = window.App;
  var FORM_SELECTOR = "[data-coffee-order='form']";
  var CHECKLIST_SELECTOR = "[data-coffee-order='checklist']";
  var SERVER_URL = "http://localhost:2403/coffeeorders";
  var Truck = App.Truck;
  var $ = window.jQuery;
  //var DataStore = App.DataStore;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var Validation = App.Validation;
  var CheckList = App.CheckList;
  var remoteDS = new RemoteDataStore(SERVER_URL);
  var myTruck = new Truck("ncc-1701", remoteDS);
  window.myTruck = myTruck;

  //for deleting pending order after clicking checklist
  var checkList = new CheckList(CHECKLIST_SELECTOR);
  checkList.addClickHandler(myTruck.deliverOrder.bind(myTruck));

  //for adding orders in backend
  var formHandler = new FormHandler(FORM_SELECTOR);
  formHandler.addSubmitHandler(function(data) {
    myTruck.createOrder.call(myTruck, data);
    checkList.addRow.call(checkList, data);
  });
  formHandler.addInputHandler(Validation.isCompanyEmail);

  //for displaying pending order even after refresh
  $(FORM_SELECTOR).ready(function() {
    myTruck.printOrders.call(myTruck, function(serverResponse) {
      $.each(serverResponse, function(i, coffeeOrder) {
        checkList.addRow.call(checkList, coffeeOrder);
      });
    });
  });


})(window);
