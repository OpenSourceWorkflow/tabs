/**
 * An accessible tab module with anmated content and autoplay
 * @module Tabs
 * @requires jquery
 * @author Markus Falk, Rodger Rüdiger
 */

define(['jquery'], function() {

  'use strict';

  var Tabs = {
    animation: {}, //animation timeout @see Tabs._start_animation
    skip_anim: 0, // skip first call of animation_start();
    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function() {
      this.$animatedTabs = $('.animated-tabs');

      this.$first_tab = $('.tab-content > div:first-child')
                          .attr('aria-expanded', 'true')
                          .attr('aria-hidden', 'false')
                          .addClass('current-tab');

      this.$tabpanels = $('.tab-content > div').
                          attr('role', 'tabpanel');

      this.$hidden_tabs = $('.tab-content > div').not('.tab-content > div:first-child')
                          .hide()
                          .attr('aria-expanded', 'false')
                          .attr('aria-hidden', 'true')
                          .attr('role', 'tab-panel');

      this.$tab_element = $('.tabs');
      this.$tab_links = $('.tab-nav h2, .tab-nav a').addClass('tab-header')
                                                    .attr('role', 'tab')
                                                    .attr('tabindex', '0')
                                                    .attr('aria-selected', 'false');

      this.$tab_nav = $('.tab-nav').attr('role', 'tablist');
      this.$first_tab_nav = $('.tab-nav > :first-child')
                              .addClass('current-tab-nav')
                              .removeAttr('tabindex')
                              .attr('aria-selected', 'true');

      this.$first_tab_nav.next().addClass('next-tab');
      this.$tabs = $('.tab-content > div');
      this.$toggle_animation_items = $('body');
    },
    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {

      // Defaults
      Tabs.autoplay_speed = 5000;
      Tabs.fade_speed = 200;
      Tabs.tab_number = 1;

      // Functions
      Tabs._cacheElements();
      Tabs._bindEvents();
      Tabs._addARIAlabels();

      // Animation bei Tabs starten
      // $('.animated-tabs').mf_DoItIfNeeded(function(){ //
        // Tabs._start_animation();
      // });

      // events
      Tabs.$tab_element.each(function() {
        $(this).trigger('tabs.initialized');
      });

    },
    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     */
    _bindEvents: function() {

      // mouse and keyboard events
      Tabs.$tab_links.on('keydown', function(event) {
        if (event.keyCode === 13) { // ENTER
          var $target_tab = $(this).attr('data-rel');
          Tabs._nextTab($(this).closest('.tabs'), $('#' + $target_tab), $(this));
        }
      });
      Tabs.$tab_links.on('click', function(event) {
        event.preventDefault();
        var $target_tab = $(this).attr('data-rel');
        Tabs._nextTab($(this).closest('.tabs'), $('#' + $target_tab), $(this));
      });

      // stop animations when hovering of focusing a tab
      $('.main-theme').mouseenter(function() {
        Tabs._stop_animation();
      });
      Tabs.$tab_links.on('focus', function(event) {
        Tabs._stop_animation();
      });

      // resume animation
      $('.main-theme').on('mouseleave', function(event) {
        Tabs.skip_anim = 0; //Set timeout for next tab
        Tabs._start_animation();
      });

    },
    /**
     * Sets ARIA attributes.
     * @function _addARIAlabels
     * @private
     */
    _addARIAlabels: function() {
      Tabs.$tab_element.each(function(index) {

        var $tab_nav = $(this).find('> .tab-nav'),
            $tab_content = $(this).find('> .tab-content');

        $tab_nav.find('> h2, > a').each(function (index) {

          // set aria-controls
          index = index + 1;
          $(this).attr('aria-controls', $(this).closest('.tabs').find('> .tab-content > :nth-child('+ index +')').attr('id'));
        });

        $tab_content.find('> div').each(function (index) {

          // set aria-labelledby
          index = index + 1;
          $(this).attr('aria-labelledby', $(this).closest('.tabs').find('> .tab-nav > :nth-child('+ index +')').attr('id'));
        });

      });
    },
    /**
     * Selects  tab
     * @function _nextTab
     * @param {jQuery object} parent tab container
     * @param {jQuery object} tab content of next tab
     * @param {jQuery object} tab head of next tab
     * @private
     */
    _nextTab: function($tab_element, $target_tab, $target_tab_nav) {

      var $current_tab = $tab_element.find('> div > .current-tab'),
          $current_tab_nav = $tab_element.find('> div > .current-tab-nav'),
          tabs_amount = $tab_element.find('> .tab-content > div').length;

      if (!$target_tab) {
        // enable next tab if autoplay enabled
        // on tab click set autoplay to index of clicked tab

        if (Tabs.tab_number < tabs_amount) {
          // check if current tab is the last
          $target_tab = $current_tab.next();
          $target_tab_nav = $current_tab_nav.next();
          Tabs.tab_number = Tabs.tab_number + 1;

        } else {
          // start over
          $target_tab = $tab_element.find('> .tab-content > div:first-child');
          $target_tab_nav = $tab_element.find('.tab-nav > .tab-header:first-child');
          Tabs.tab_number = 1;

        }

      } else {

        // set autoplay counter to index of clicked tab
        if($tab_element.hasClass('animated-tabs')) {
          Tabs.tab_number = $target_tab_nav.index() + 1;
        }
      }

      // set current state to next tab
      $current_tab.stop().fadeOut(this.fade_speed, function() {

        // change state of tab content
        $current_tab.removeClass('current-tab')
                    .attr('aria-expanded', 'false')
                    .attr('aria-hidden', 'true');

        // change state of tab head
        $current_tab_nav.removeClass('current-tab-nav')
                        .attr('tabindex', '0')
                        .attr('aria-selected', 'false');

        // set new tab state to current
        $target_tab.fadeIn(this.fade_speed, function() {
          // events
          $target_tab.trigger('tabs.opened', [$target_tab_nav, $target_tab]);
        })
         .attr('aria-expanded', 'true')
         .attr('aria-hidden', 'false')
         .addClass('current-tab');

        // remove classes for previous and next tab
        $current_tab_nav.prev().removeClass('prev-tab');
        $current_tab_nav.next().removeClass('next-tab');

        // change current tab state
        $target_tab_nav.addClass('current-tab-nav')
                      .removeAttr('tabindex')
                      .attr('aria-selected', 'true');

        // set classes for previous and next tab
        $target_tab_nav.next().addClass('next-tab');
        $target_tab_nav.prev().addClass('prev-tab');

        // animate tab content
        Tabs._animate_content($target_tab);

      });

    },
    /**
     * Starts animation of tabs.
     * @function _start_animation
     * @private
     */
    _start_animation: function() {

      // check if first animation should be skipped
      if (Tabs.skip_anim > 0) {
        Tabs.$animatedTabs.each(function() {
          var that = $(this);

          Tabs._nextTab(that);

          that.trigger('tabs.animated', that);

        });
      }

      // set timeout for animation and increases skip_anim to animate following tab changes
      Tabs.animation = setTimeout(Tabs._start_animation, Tabs.autoplay_speed);
      Tabs.skip_anim = Tabs.skip_anim + 1;



    },
    /**
     * Clears timeout of tab animation
     * @function _stop_animation
     * @private
     */
    _stop_animation: function() {
      clearTimeout(Tabs.animation);
    },
    /**
     * Animates tab content.
     * @function _animate_content
     * @private
     */
    _animate_content: function($target_tab) {
      $target_tab.children().hide().delay(0).stop().fadeIn(200);
    }
  };

  return /** @alias module:Tabs */ {
    /** init */
    init: Tabs.init
  };

});
