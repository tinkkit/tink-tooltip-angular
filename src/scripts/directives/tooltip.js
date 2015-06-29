'use strict';
(function(module) {
  try {
    module = angular.module('tink.tooltip');
  } catch (e) {
    module = angular.module('tink.tooltip', ['ngSanitize']);
  }
  module.directive('tinkTooltip', ['$compile',function ($compile) {
    return {
      restrict: 'A',
      scope: {
        tinkTooltip: '@',
        tinkTrigger:'@'
      },
      link: function(scope,elem,attrs) {
        scope.tinkTrigger = scope.tinkTrigger || 'click';
        scope.tinkPlacement = scope.tinkPlacement || 'bottomg';

        scope.$watch('tinkTrigger',function(nTrigger,oTrigger){
          if(oTrigger !== nTrigger){
            if(nTrigger === 'hover'){
              bindHover();
            }
            if(oTrigger === 'hover'){
              unbindHover();
            }
            if(oTrigger === 'click'){
              unbindClick();
            }
            if(nTrigger === 'click'){
              bindClick();
            }
          }else{
            if(nTrigger === 'click'){
              unbindClick();
              bindClick();
            }else{
              unbindHover();
              bindHover();
            }
            
          }
        });
        placeTooltip();

        function bindHover(){
          angular.element(elem).bind('mouseenter.tooltip',function(){
            showTooltip();
          });
          angular.element(elem).bind('mouseleave.tooltip',function(){
            hideTooltip();
          });
        }

        function unbindHover(){
          angular.element(elem).unbind('mouseenter.tooltip');
          angular.element(elem).unbind('mouseleave.tooltip');
        }

        function bindClick(){
          angular.element(elem).bind('click.tooltip',function(){
            showTooltip();
          });
        }

        function unbindClick(){
          angular.element(elem).unbind('click.tooltip');
        }
        var toolTip;
        function placeTooltip(){
          toolTip = $($compile('<div class="popover"><span class="arrow" ng-bind-html="tinkTooltip"></span><button ng-click="close($event)">close</button></div>')(scope));
          var divElemen = $('<div class="tinkWrapper"></div>');
          $(elem).after(divElemen);
          //toolTip.css('position','absolute');

          if(scope.tinkPlacement === 'bottom'){
            divElemen.append($(elem));
            $(divElemen).append(toolTip);
            toolTip.addClass('arrow-top-left');
            toolTip.css('margin-top','10px');
          }else if(scope.tinkPlacement === 'right'){

          }else if(scope.tinkPlacement === 'left'){

          }else{
            $(divElemen).append(toolTip);
            $(divElemen).append(elem);
            toolTip.addClass('arrow-bottom-left');
            toolTip.css('margin-bottom','10px');
          }

          //toolTip.css('visibility','hidden');
          
        }

        function showTooltip(){
          toolTip.css('visibility','visible');
        }

        function hideTooltip(){
          toolTip.css('visibility','hidden');
        }

        scope.close = function($event){
          hideTooltip();
         $event.preventDefault(); 
         $event.stopPropagation();
        }

      }
    };
  }]);
})();
