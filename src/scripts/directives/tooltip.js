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
        scope.tinkTrigger = scope.tinkTrigger || 'hover';

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
            unbindHover();
            bindHover();
          }
        });

        var toolTip = $($compile('<div class="popover arrow-top-left"><span class="arrow" ng-bind-html="tinkTooltip"></span></div>')(scope));
        toolTip.css('margin-top','calc('+($(elem).outerHeight(true)+10)+'px)');
        toolTip.css('top','0px');

        toolTip.css('maxWidth','200px');
        toolTip.css('position','absolute');

        $(elem).css('position','relative');

        toolTip.css('visibility','');
        $(elem).append(toolTip);

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

        function showTooltip(){
          toolTip.css('visibility','visible');
        }

        function hideTooltip(){
          //toolTip.css('visibility','hidden');
        }

        scope.close = function(){
          hideTooltip();
        }

      }
    };
  }]);
})();
