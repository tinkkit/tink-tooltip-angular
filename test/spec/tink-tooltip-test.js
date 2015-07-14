'use strict';
describe('tink-interactive-table-angular', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, scope;

  beforeEach(module('tink.tooltip'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  var templates = {
    'click': {
      scope: {},
      element: '<button tink-tooltip-disabled="disable" tink-tooltip-trigger="click" tink-tooltip="dlik" tink-tooltip-align="left">Open tooltip</button>'
    },
    'hover': {
      scope: {},
      element: '<button tink-tooltip-disabled="disable" tink-tooltip="hier is content jippie" tink-tooltip-align="right">Open tooltip</button>'
    },
    'template': {
      scope: {},
      element: '<button tink-tooltip-template="template.html" tink-tooltip-trigger="click" tink-tooltip tink-tooltip-align="right">Open tooltip</button>'
    }
  };


  describe('popup should show', function() {
    it('on click',function(){
      var element = compileDirective('click',{position:'left'});
      element.triggerHandler('click');
      scope.$digest();
      expect(sandboxEl.find('div.tooltip').length).toBe(1);
    });

    it('on click disabled',function(){
      var element = compileDirective('click',{disable:'true'});
      element.triggerHandler('click');
      scope.$digest();
      expect(sandboxEl.find('div.tooltip').length).toBe(0);
    });

    it('on mouseenter',function(){
      var element = compileDirective('hover');
      element.mouseenter()     
      scope.$digest();
      expect(sandboxEl.find('div.tooltip').length).toBe(1);
    });

    it('on mouseenter disabled',function(){
      var element = compileDirective('hover',{disable:'true'});
      element.mouseenter();
      scope.$digest();
      expect(sandboxEl.find('div.tooltip').length).toBe(0);
    });
  });

   describe('template', function() {
    beforeEach(inject(function ($templateCache) {
      $templateCache.put('template.html', '<div>Here comes the conent oh yeahhh, some good content.</div>');
    }));

    it('has same content',function(){
      var element = compileDirective('template',{position:'left'});
      element.triggerHandler('click');
      scope.$digest();
      expect($(sandboxEl.find('div.tooltip').children()[1]).html()).toBe('Here comes the conent oh yeahhh, some good content.')
    });

    it('test get template function',function(){
      var element = compileDirective('template',{position:'left'});
      var ctrl = element.isolateScope().ctrl;
      expect(ctrl.haalTemplateOp('template.html').$$state.value).toBe('<div>Here comes the conent oh yeahhh, some good content.</div>')
    });

    it('check if popover html is correct',function(){
      var element = compileDirective('template',{position:'left'});
      var ctrl = element.isolateScope().ctrl;
      expect(ctrl.popoverHtml()).toBe('<div class="tooltip {{arrowPlacement}}"><span class="arrow"></span></div>');
      
    });

  });


});