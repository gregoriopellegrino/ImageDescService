//Edit Image.
define([
  'jquery',
  'underscore',
  'backbone',
  'ckeditor',
  'bootstrap',
  '/javascripts/models/dynamic_image.js',
  '/javascripts/models/dynamic_description.js',
  'text!/javascripts/templates/edit_image.html'
], function($, _, Backbone, ckeditor, bootstrap, DynamicImage, DynamicDescription, editImageTemplate){
  var EditImageView = Backbone.View.extend({
    
    //div.
    tagName:  "div",

    events: {
      "change .should_be_described": "saveNeedsDescription",
      "change .image_category": "saveImageCategory",
      "click .cancel": "cancelEditor",
      "click .save": "saveDescription"
    },

    ckeditorConfig: {
        extraPlugins: 'onchange',
        minimumChangeMilliseconds: 100,
        scayt_autoStartup:true,
        toolbar :
        [
            { name: 'basicstyles', items : [ 'Bold','Italic','Underline' ] },
            { name: 'paragraph', items : [ 'NumberedList','BulletedList' ] },
            { name: 'editing', items : ['Scayt' ] },
            { name: 'styles', items : [ 'Format' ] },
            { name: 'insert', items : [ 'Table','Link','Unlink' ] },
            { name: 'tools', items : [ 'Undo', 'Redo', '-', 'Source','Maximize' ] }
        ]
    },

    render: function() {
      var compiledTemplate = _.template( editImageTemplate, 
        { 
          image: this.model, 
          image_categories: this.imageCategories.models, 
          previousImage: this.previousImage,
          nextImage: this.nextImage
        });
      this.$el.html(compiledTemplate);
      return this;
    },

    saveImageCategory: function(e) {
      var imageCategory = $(e.currentTarget).val();
      //Save.
      this.model.save({"image_category_id": imageCategory});
    },

    saveNeedsDescription: function(e) {
      var shouldBeDescribed = $(e.currentTarget).val();
      //First, update the image.
      this.model.save({"should_be_described": shouldBeDescribed});
      if (shouldBeDescribed == "true") {
        this.showDynamicDescriptionForm();
      }
    },

    showDynamicDescriptionForm: function() {
      var editView = this;
      var longDescription = editView.$(".long-description");
      $("textarea", $(longDescription)).ckeditor(editView.ckeditorConfig);
      //Show edit tab.
      $("#edit-tab-" + editView.model["id"]).tab('show');
      longDescription.show();
    },

    cancelEditor: function(e) {
      e.preventDefault();
      this.$(".long-description").hide();
    },

    saveDescription: function(e) {
      var editView = this;
      e.preventDefault();
      //Create a new description.
      var dynamicDescription = new DynamicDescription();
      //Get value from ckeditor.
      editView.$("textarea").ckeditor(function(textarea){
        var dynamicDescription = new DynamicDescription();
        dynamicDescription.save(
          {
            "book_id": $("#book_id").val(), 
            "dynamic_description": $(textarea).val(), 
            "dynamic_image_id": editView.model.get("id")
          }, 
          {
            success: function () {
              editView.$(".text-success").html("The description has been saved.");
            },
            error: function (model, response) {
              editView.$(".text-danger").html("There was an error saving this description.");
            }
          }
        );
      });
    }


  });
  return EditImageView;
});