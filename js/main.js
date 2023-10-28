// attempts to work with AMD modules before switching to es modules
// require([
// "esri/Map",
// "esri/views/MapView",
// "esri/portal/Portal",
// "esri/widgets/BasemapGallery",
// "esri/widgets/BasemapGallery/support/PortalBasemapsSource",
// "esri/widgets/Expand",
// "esri/core/reactiveUtils"
// ], function(
// Map,
// MapView,
// Portal,
// BasemapGallery,
// PortalBasemapsSource,
// Expand,
// reactiveUtils
// ) {


// const portal = new Portal();

// // source for basemaps from a portal group
// // containing basemaps with different projections
// const source = new PortalBasemapsSource({
//   portal,
//   query: {
//     id: "bdb9d65e0b5c480c8dcc6916e7f4e099"
//   }
// });


// const map = new Map({
//   basemap: {
//     portalItem: {
//       id: "8d91bd39e873417ea21673e0fee87604" // nova basemap
//     // id: "30d6b8271e1849cd9c3042060001f425" // hybrid basemap
//     }
//   }
// });

// // center the view over 48 states
// const view = new MapView({
//   container: "viewDiv",
//   map: map,
//   center: [-100, 35],
//   zoom: 2,
//   constraints: {
//     snapToZoom: false
//   }
// });
// view.ui.add("srDiv", "top-right");

// const bgExpand = new Expand({
//   view,
//   content: new BasemapGallery({ source, view }),
//   expandIcon: "basemap"
// });
// view.ui.add(bgExpand, "top-right");

// reactiveUtils.watch(() => view.spatialReference, (spatialReference)=> {
//   document.getElementById("srDiv").innerHTML = `view.spatialReference.wkid = <b>${spatialReference.wkid}</b>`;
// });
// });
require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/widgets/Editor",
    "esri/views/MapView",
    "esri/popup/content/AttachmentsContent",
    "esri/popup/content/TextContent",
    "esri/widgets/Expand",
    "esri/core/reactiveUtils"
  ], (Map, FeatureLayer, Editor, MapView, AttachmentsContent, TextContent, Expand, reactiveUtils) => {
    // Create the Map
    const map = new Map({
      basemap: "topo-vector"
    });
    let editor, features;
    const editThisAction = {
      title: "Feature Details",
      id: "edit-this",
      className: "esri-icon-edit"
    };

    // Create a popupTemplate for the featurelayer and pass in a function to set its content and specify an action to handle editing the selected feature
    const template = {
      title: "Trailhead: {POINAME}",
      content: difficultyLevel,
      fieldInfos: [
        {
          fieldName: "coordinates"
        },
        {
          fieldName: "unitname"
        }
      ],
      actions: [editThisAction]
    };

    // difficulty level function based on esri sample code, but I would like to impliment trail dificulty for the trailheads and trails if I can find a more detailed dataset, so I'm leaving this code here for future development
    // Function that creates two popup elements for the template: attachments and text

    function difficultyLevel(feature) {
      // 1. Set how the attachments should display within the popup
      const attachmentsElement = new AttachmentsContent({
        displayType: "list"
      });

      const textElement = new TextContent();
      const poi = feature.graphic.attributes.POINAME;
        const unit = feature.graphic.attributes.UNITNAME;
        const coordinates = feature.coordinates;
        return textElement.text = "The " + poi + " trailhead is located in " + unit + " and has coordinates of " + coordinates + ".";

    //   const level = feature.graphic.attributes.difficulty;
    //   const green = "<b><span style='color:green'>" + level + "</span></b>.";
    //   const purple = "<b><span style='color:purple'>" + level + "</span></b>.";
    //   const red = "<b><span style='color:red'>" + level + "</span></b>.";

      // If the feature's "difficulty" attribute is a specific value, set it a certain color
      // "easy" = green
      // "medium" = purple
      // "hard" = red
    //   switch (level) {
    //     case "easy":
    //       textElement.text = "The {POINAME} trail has a difficulty level of " + green;
    //       return [textElement, attachmentsElement];
    //       break;
    //     case "medium":
    //       textElement.text = "The {POINAME} trail has a difficulty level of " + purple;
    //       return [textElement, attachmentsElement];
    //       break;
    //     case "hard":
    //       textElement.text = "The {POINAME} trail has a difficulty level of " + red;
    //       return [textElement, attachmentsElement];
    //   }
    }
// future feature layers can be added similar to below when i find more datasets.
    const featureLayer = new FeatureLayer({
    //   url: "https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/GRTE_TRANS_Roads_1/FeatureServer/0/query?outFields=*&where=1%3D1", // road service Teton NP
      url: "https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/GRTE_TRANS_Trailhead_1/FeatureServer/0/query?outFields=*&where=1%3D1", // Trailhead service Teton NP

      outFields: ["*"],
      popupTemplate: template
    });
    map.add(featureLayer);

    // Create the MapView
    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 10,
      center: [-110.69, 43.79]
    });

    view.when(() => {
      // Create the Editor with the specified layer and a list of field configurations
      editor = new Editor({
        view: view,
        // Hide the snapping controls as it is not needed for this specific workflow
        visibleElements: { snappingControls: false },
        container: document.createElement("div"),
        layerInfos: [
          {
            layer: featureLayer,
            formTemplate: {
              // autocasts to FormTemplate
              elements: [
                // autocasts to FieldElement
                {
                  type: "field",
                  fieldName: "POINAME",
                  label: "Trail name",
                  editableExpression: false
                },
                {
                  type: "Point",
                  fieldName: "coordinates",
                  label: "coordinates",
                  editableExpression: false
                },
                {
                  type: "field",
                  fieldName: "UNITNAME",
                  label: "Park name",
                  editableExpression: false
                }
              ]
            }
          }
        ]
      });
// edit feature not working, and I will probably only use it after oauth is implimented, so I'm leaving this code here for future development

      // Execute each time the "Edit feature" action is clicked
      function editThis() {
        // If the Editor's activeWorkflow is null, make the popup not visible
        if (!editor.activeWorkFlow) {
          view.popup.visible = false;
          // Call the Editor update feature edit workflow

          editor.startUpdateWorkflowAtFeatureEdit(view.popup.selectedFeature);
          view.ui.add(editor, "top-right");
        }

  // my info popup is based on one of the esri samples, used for editing datapoints. I would like to impliment a edit feature for the trail data, so I based the info popup on the edit feature sample. I would like to impliment a feature that allows users to edit the trail data, but I'm not sure how to do that yet. I'm leaving this code here for future development

        reactiveUtils.when(
          () => editor.viewModel.state === "ready",
          () => {
            // Remove the editor and open the popup again
            view.ui.remove(editor);
            view.openPopup({
              fetchFeatures: true,
              shouldFocus: true
            });
          }
        );
      }

    //   Event handler that fires each time an action is clicked
      reactiveUtils.on(
        () => view.popup,
        "trigger-action",
        (event) => {
          if (event.action.id === "edit-this") {
            editThis();
          }
        }
      );
    });

    // Watch when the popup is visible
    reactiveUtils.watch(
      () => view.popup?.visible,
      (event) => {
        // Check the Editor's viewModel state, if it is currently open and editing existing features, disable popups
        if (editor.viewModel.state === "editing-existing-feature") {
          view.closePopup();
        } else {
          // Grab the features of the popup
          features = view.popup.features;
        }
      }
    );

    featureLayer.on("apply-edits", () => {
      // Once edits are applied to the layer, remove the Editor from the UI
      view.ui.remove(editor);

      // Iterate through the features
      features.forEach((feature) => {
        // Reset the template for the feature if it was edited
        feature.popupTemplate = template;
      });

      // Open the popup again and reset its content after updates were made on the feature
      if (features) {
        view.openPopup({
          features: features
        });
      }

      // Cancel the workflow so that once edits are applied, a new popup can be displayed
      editor.viewModel.cancelWorkflow();
    });

    const expandInfo = new Expand({
      expandTooltip: "Open for info",
      collapseTooltip: "Close info",
      expanded: true,
      view: view,
      content: document.getElementById("info")
    });

    view.ui.add(expandInfo, {
      position: "top-left",
      index: 1
    });
  });