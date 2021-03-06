({
    getPics: function(component) {
        var action = component.get("c.getPics");
        action.setParams({recordId: component.get("v.recordId")});
      
        component.set("v.pics", []);
        action.setCallback(this, function (response) {
            var state = response.getState();
            
            if (state === "SUCCESS") {
                component.set("v.pics", response.getReturnValue());
            } else if (state === "ERROR") {
                var errorMessage = "";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    errorMessage = errors[0].message;
                }
                if (errorMessage === "") {
                    errorMessage = "Unknown Error";
                }
                console.log(errorMessage);
                component.find("notificationsLib").showNotice({
                    "variant": "Error",
                    "header": "Error",
                    "message": errorMessage
                });
            }
        });
        $A.enqueueAction(action);
    },
    
    saveFav: function(component) {
        component.find("recordHandler").saveRecord($A.getCallback(function(saveResult) {
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                // handle component related logic in event handler
                component.find("notificationsLib").showToast({
                    "title": "Saved",
                    "message": "Favorite Saved!"
                });
            } else if (saveResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "DRAFT") {
                console.log("Server not reachable. DRAFT will be saved at a later time when the server is reachable.");
            } else if (saveResult.state === "ERROR") {
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }));
    }
})