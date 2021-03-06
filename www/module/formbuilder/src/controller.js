// Generated by CoffeeScript 1.9.2
(function() {
  var copyObjectToScope;

  copyObjectToScope = function(object, scope) {

    /*
    Copy object (ng-repeat="object in objects") to scope without `hashKey`.
     */
    var key, value;
    for (key in object) {
      value = object[key];
      if (key !== '$$hashKey') {
        scope[key] = angular.copy(value);
      }
    }
  };

  angular.module('builder.controller', ['builder.provider']).controller('fbFormObjectEditableController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.setupScope = function(formObject) {

        /*
        1. Copy origin formObject (ng-repeat="object in formObjects") to scope.
        2. Setup optionsText with formObject.options.
        3. Watch scope.label, .description, .placeholder, .required, .settings, .options then copy to origin formObject.
        4. Watch scope.optionsText then convert to scope.options.
        5. setup validationOptions
         */
        copyObjectToScope(formObject, $scope);
        $scope.optionsText = formObject.options.join('\n');
        $scope.$watch('[label, description, placeholder, required, options, settings, validation]', function() {
          formObject.label = $scope.label;
          formObject.description = $scope.description;
          formObject.placeholder = $scope.placeholder;
          formObject.required = $scope.required;
          formObject.options = $scope.options;
          formObject.settings = $scope.settings;
          return formObject.validation = $scope.validation;
        }, true);
        return $scope.$watch('optionsText', function(text) {
          var component, x;
          $scope.options = (function() {
            var i, len, ref, results;
            ref = text.split('\n');
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              x = ref[i];
              if (x.length > 0) {
                results.push(x);
              }
            }
            return results;
          })();
          component = $builder.components[formObject.component];
          return $scope.validationOptions = component.validationOptions;
        });
      };
      return $scope.data = {
        model: null,
        backup: function() {

          /*
          Backup input value.
           */
          return this.model = {
            label: $scope.label,
            description: $scope.description,
            placeholder: $scope.placeholder,
            required: $scope.required,
            settings: $scope.settings,
            optionsText: $scope.optionsText,
            validation: $scope.validation
          };
        },
        rollback: function() {

          /*
          Rollback input value.
           */
          if (!this.model) {
            return;
          }
          $scope.label = this.model.label;
          $scope.description = this.model.description;
          $scope.placeholder = this.model.placeholder;
          $scope.required = this.model.required;
          $scope.$parent.settings = this.model.settings;
          $scope.optionsText = this.model.optionsText;
          return $scope.validation = this.model.validation;
        }
      };
    }
  ]).controller('fbComponentsController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.selectGroup = function($event, group) {
        var component, name, ref, results;
        if ($event != null) {
          $event.preventDefault();
        }
        $scope.activeGroup = group;
        $scope.components = [];
        ref = $builder.components;
        results = [];
        for (name in ref) {
          component = ref[name];
          if (component.group === group) {
            results.push($scope.components.push(component));
          }
        }
        return results;
      };
      $scope.groups = $builder.groups;
      $scope.activeGroup = $scope.groups[0];
      $scope.allComponents = $builder.components;
      return $scope.$watch('allComponents', function() {
        return $scope.selectGroup(null, $scope.activeGroup);
      });
    }
  ]).controller('fbComponentController', [
    '$scope', function($scope) {
      return $scope.copyObjectToScope = function(object) {
        return copyObjectToScope(object, $scope);
      };
    }
  ]).controller('fbFormController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder, $timeout;
      $builder = $injector.get('$builder');
      $timeout = $injector.get('$timeout');
      if ($scope.input == null) {
        $scope.input = [];
      }
      return $scope.$watch('form', function() {
        var page_number;
        $scope.questionPageArray = [];
        page_number = 0;
        $scope.questionPageArray[0] = [];
        $scope.questionPageArray[0].heading = '';
        $scope.questionPageArray[0].show = true;
        $scope.form.forEach(function(question) {
          var pageArray;
          question = angular.copy(question);
          pageArray = $scope.questionPageArray[page_number];
          if (!pageArray) {
            pageArray = [];
          }
          if (question.component !== 'section') {
            question.index -= page_number;
            pageArray.push(question);
            return $scope.questionPageArray[page_number] = pageArray;
          } else {
            page_number++;
            pageArray = $scope.questionPageArray[page_number];
            if (!pageArray) {
              pageArray = [];
            }
            pageArray.sectionObj = question;
            pageArray.heading = question.label;
            pageArray.show = question.required;
            return $scope.questionPageArray[page_number] = pageArray;
          }
        });
        if ($scope.input.length > $scope.form.length) {
          $scope.input.splice($scope.form.length);
        }
        return $timeout(function() {
          return $scope.$broadcast($builder.broadcastChannel.updateInput);
        });
      }, true);
    }
  ]).controller('fbFormObjectController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.copyObjectToScope = function(object) {
        return copyObjectToScope(object, $scope);
      };
      return $scope.updateInput = function(value) {

        /*
        Copy current scope.input[X] to $parent.input.
        @param value: The input value.
         */
        var input;
        input = {
          id: $scope.formObject.id,
          label: $scope.formObject.label,
          value: value != null ? value : ''
        };
        return $scope.$parent.input.splice($scope.index, 1, input);
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=controller.js.map
