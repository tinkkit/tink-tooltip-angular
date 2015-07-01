'use strict';
(function(module) {
  try {
    module = angular.module('tink.tooltip');
  } catch (e) {
    module = angular.module('tink.tooltip', []);
  }
  module.directive( 'tinkTooltip', ['$q','$templateCache','$http','$compile','$timeout','$window','$rootScope',function ($q,$templateCache,$http,$compile,$timeout,$window,$rootScope) {
  return {
    restrict:'EA',
    compile: function compile( tElement, attrs ) {
      var fetchPromises = {};
      //to retrieve a template;
      function haalTemplateOp(template) {
        // --- if the template already is in our app cache return it. //
        if (fetchPromises[template]){
          return fetchPromises[template];
        }
        // --- If not get the template from templatecache or http. //
        return (fetchPromises[template] = $q.when($templateCache.get(template) || $http.get(template))
          .then(function (res) {
            // --- When the template is retrieved return it. //
            if (angular.isObject(res)) {
              $templateCache.put(template, res.data);
              return res.data;
            }
            return res;
          }));
      }
      var theTemplate = null;
      if(attrs.tinkTooltipTemplate){
        theTemplate = haalTemplateOp(attrs.tinkTooltipTemplate);
      }


      return {
          post: function postLink( scope, element, attributes ) {
                var placement = attributes.tinkPopoverPlace;
                var align = attributes.tinkPopoverAlign;
                var trigger = attributes.tinkTooltipTrigger || 'hover';
                var spacing = 2;


                var isOpen = null;
                if(trigger === 'click'){
                  element.bind('click',function(){
                    scope.$apply(function(){
                      if(isOpen === null){
                        show();
                      }else{
                        hide();
                      }

                    });
                  });
                }else if(trigger === 'hover'){
                   element.bind('mouseenter',function(){
                    show();
                   });
                   element.bind('mouseleave',function(){
                    hide();
                   });
                }

              function popoverHtml(){
                var html = '<div class="tooltip {{arrowPlacement}}">'+
                            '<span class="arrow"></span>'+
                          '</div>';
                          return html;
              }

              function childOf(c,p){ //returns boolean
                while((c=c.parentNode)&&c!==p){
                }
                return !!c;
              }

              /*$(document).bind('click',function(e){
                var clicked = $(e.target).parents('.popover').last();
                if(isOpen && !childOf($(e.target).get(0),element.get(0)) && ($(e.target).get(0) !== element.get(0) || clicked.length > 0)){
                  if(isOpen.get(0) !== clicked.get(0) &&  $(e.target).get(0) !== isOpen.get(0)){
                    hide();
                  }
                }

              });*/

              function show (){
                if(theTemplate !== null){
                  theTemplate.then(function(data){
                    if(isOpen === null){
                      var elContent = $($compile(data)(scope));
                      var el =$($compile(popoverHtml())(scope));
                      el.css('position','absolute');
                      el.css('visibility','hidden');
                      elContent.insertAfter(el.find('span'));

                      // el.css('z-index','99999999999');
                      if(placement === 'top'){
                        element.before(el);
                      }else{
                        element.after(el);
                      }

                      el.css('top',-100);
                      el.css('left',-10);

                        calcPos(element,el,attrs.tinkTooltipAlign,align,spacing);

                      if(trigger === 'click'){
                        el.append($($compile('<a href="#" class="close" ng-click="close($event)">Sluiten</a>')(scope)));
                      }

                      if(attributes.tinkPopoverGroup){
                        $rootScope.$broadcast('popover-open', { group: attributes.tinkPopoverGroup,el:el });
                      }

                      isOpen = el;
                    }
                  });
                }
              }

              var timeoutResize = null;

              $window.addEventListener('resize', function() {
                if(isOpen!== null){
                  $timeout.cancel( timeoutResize);
                  timeoutResize = $timeout(function(){
                   // setPos(isOpen,placement,align,spacing);
                    calcPos(element,isOpen,attrs.tinkTooltipAlign,align,spacing);
                  },250);
                }
              }, true);

              $window.addEventListener('scroll', function() {
                if(isOpen!== null){
                  $timeout.cancel( timeoutResize);
                  timeoutResize = $timeout(function(){
                   // setPos(isOpen,placement,align,spacing);
                    calcPos(element,isOpen,attrs.tinkTooltipAlign,align,spacing);
                  },450);
                }
              }, true);

              function hide(){
                if(isOpen !== null){
                  isOpen.remove();
                  isOpen = null;
                }
              }

              scope.close = function(event){
                hide();
                event.preventDefault();
                event.stopPropagation();
              }

                 //The function that will be called to position the tooltip;
            function getPos(el,placement,align,spacing){


                var porcent = {right:0.85,left:0.15,top:0.15,bottom:0.85};
                var arrowHeight = 10;
                var arrowWidth = 10;

                var alignLeft = 0;
                var alignTop = 0;
                if(align === 'center'){
                  alignLeft = (el.outerWidth(true) / 2)-(element.outerWidth(true)/2);
                  alignTop = 0;
                }else if(align === 'left' || align === 'right'){
                  alignLeft = (el.outerWidth(true)*porcent[align]) -(element.outerWidth(true)/2);
                }else if(align === 'top' || align === 'bottom'){
                  alignTop = 0;
                }

                var left = element.position().left - alignLeft;
                var top = null;
                  if(placement === 'top'){
                    top = element.position().top - (el.outerHeight() + arrowHeight +spacing);
                  }else if(placement === 'bottom'){
                    top = element.position().top + element.outerHeight() + arrowHeight +spacing;
                  }else if(placement === 'right'){
                    left = element.position().left + element.outerWidth(true) + arrowWidth + spacing;
                  }else if(placement === 'left'){
                    left = element.position().left - el.outerWidth(true) - arrowWidth - spacing;
                  }

                  if(align === 'right'){
                    left = element.position().left + (element.outerWidth(true) - el.outerWidth(true));
                  }else if(align === 'left'){
                    left = element.position().left;
                  }else if(align === 'top'){
                    top = element.position().top;
                  }else if(align === 'bottom'){
                    top = element.position().top - el.outerHeight(true) + element.outerHeight(true);
                  }else if(align === 'center'){
                    if(placement === 'top' || placement === 'bottom'){
                      left = element.position().left - ((el.outerWidth(true) / 2)-(element.outerWidth(true)/2));
                    }else if(placement === 'left' || placement === 'right'){
                      top = element.position().top - ((el.outerHeight(true) / 2)-(element.outerHeight(true)/2));
                    }
                  }


                    return {top:top,left:left,place:placement,align:align};

            }


              function arrowCal(align){
                  var arrowCss = 'arrow-';

                  switch(align){
                    case 'left':
                      arrowCss = arrowCss + 'right';
                      break;
                    case 'right':
                      arrowCss = arrowCss + 'left';
                      break;
                    case 'top':
                      arrowCss = arrowCss + 'bottom-left';
                      break;
                    case 'bottom':
                      arrowCss = arrowCss + 'top-left';
                      break;
                  }

                  scope.arrowPlacement = arrowCss;
                }
              arrowCal(placement,align);

              //calculate the position
              function calcPos(element,el,place,align,spacing){
                switch(place){
                    case 'left':
                      align = 'center';
                      break;
                    case 'right':
                      align = 'center';
                      break;
                    case 'top':
                      align = 'left';
                      break;
                    case 'bottom':
                      align = 'left';
                      break;
                  }
                function calcPostInside(){
                  var data = getPos(el,place,align,spacing);
                    el.css('top',data.top);
                    el.css('left',data.left);
                    arrowCal(data.place);
                }
                $timeout(function(){
                  calcPostInside();
                },25);

                el.css('visibility','visible');
              }

          }
      };
    }
  };

}]);
})();
;angular.module('tink.tooltip').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/tem.html',
    "<div> Als je de schrijfwijze van een naam niet goed kent of je hebt maar een gedeelte van de naam die je zoekt, kan je fonetisch zoeken inschakelen. Je zal dan niet alleen exacte resultaten krijgen, maar ook namen die gelijkaardig zijn aan de zoektermen die je opgeeft. <div class=margin-top> <cite>TIP: vervang letters die je niet kent door een sterretje (*) !</cite> </div> </div>"
  );

}]);
