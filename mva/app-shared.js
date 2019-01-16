function AppStorage(namespace) {
  this.STATE = namespace + "_APP_STATE";
  this.HISTORY = namespace + "_SURVEY_HISTORY";

  this.getHistory = function () {
    return JSON.parse(localStorage.getItem(this.HISTORY)) || [];
  };

  this.setHistory = function (history) {
    return localStorage.setItem(this.HISTORY, JSON.stringify(history));
  };
}

AppStorage.prototype.getState = function () {
  return JSON.parse(localStorage.getItem(this.STATE));
};

AppStorage.prototype.setState = function (survey) {
  return localStorage.setItem(this.STATE, JSON.stringify(survey));
};

AppStorage.prototype.getHistory = function () {
  return this.getHistory();
};

AppStorage.prototype.saveSurveyToHistory = function (survey) {
  var history = this.getHistory();
  history.unshift(survey);
  this.setHistory(history);
};

AppStorage.prototype.removeHistoryAt = function (index) {
  var history = this.getHistory();
  history.splice(index, 1);
  this.setHistory(history);
};
var Validator = function () {

  function message(key) {
    switch (key) {
      case 'gteZero':
        return Locale.t('validator.gteZero');
        break;
      case 'gteOne':
        return Locale.t('validator.gteOne');
        break;
      case 'dayOfMonth':
        return Locale.t('validator.dayOfMonth');
        break;
      case 'percent':
        return Locale.t('validator.percent');
        break;
      case 'numWeeks':
        return Locale.t('validator.numWeeks');
        break;
      case 'price':
        return Locale.t('validator.price');
        break;
      case 'boolean':
        return Locale.t('validator.boolean');
        break;
      case 'selectOne':
        return Locale.t('validator.selectOne');
        break;
    };
  }

  // If error is present, add it to key in the existing errors
  function insertError(errors, key, error) {
    if (error) {
      var newErrors = {};
      newErrors[key] = error;
      _.extend(errors, newErrors);
    }
  }

  return {

    gteZero: function (errors, key, value) {
      if (!_.isNumber(value) || value < 0) {
        insertError(errors, key, message('gteZero'));
        return true;
      }
      return false;
    },

    gteOne: function (errors, key, value) {
      if (!_.isNumber(value) || value < 1) {
        insertError(errors, key, message('gteOne'));
        return true;
      }
      return false;
    },

    dayOfMonth: function (errors, key, value) {
      if (!_.isNumber(value) || value <= 0 || value > 31) {
        insertError(errors, key, message('dayOfMonth'));
        return true;
      }
      return false;
    },

    percent: function (errors, key, value) {
      if (!_.isNumber(value) || value < 0 || value > 100) {
        insertError(errors, key, message('percent'));
        return true;
      }
      return false;
    },

    numWeeks: function (errors, key, value) {
      if (!_.isNumber(value) || value <= 0) {
        insertError(errors, key, message('numWeeks'));
        return true;
      }
      return false;
    },

    price: function (errors, key, value) {
      if (!_.isNumber(value) || value <= 0) {
        insertError(errors, key, message('price'));
        return true;
      }
      return false;
    },

    boolean: function (errors, key, value) {
      if (value != true && value != false) {
        insertError(errors, key, message('boolean'));
        return true;
      }
      return false;
    },

    selectOne: function (errors, key, value) {
      if (value == null) {
        insertError(errors, key, message('selectOne'));
        return true;
      }
      return false;
    }
  };
}();
var BooleanInput = React.createClass({
  displayName: 'BooleanInput',


  noChanged: function (e) {
    var newVal = e.target.checked == false;
    this.props.onChange(this.state.name, newVal);
    this.setState({ value: newVal });
  },

  yesChanged: function (e) {
    var newVal = e.target.checked == true;
    this.props.onChange(this.state.name, newVal);
    this.setState({ value: newVal });
  },

  getInitialState: function () {
    return {
      name: this.props.name,
      value: this.props.value
    };
  },

  render: function () {
    if (this.props.hidden) return null;

    var className = 'u-full-width';
    if (this.props.error) className += ' validation-error';

    var rowClass = 'row row-input';
    if (this.props.even) rowClass += ' row-even';

    return React.createElement(
      'div',
      { className: rowClass },
      React.createElement(
        'div',
        { className: 'eight columns' },
        this.props.text || ''
      ),
      React.createElement(
        'div',
        { className: 'four columns' },
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'radio',
            name: this.state.name,
            checked: this.state.value == true,
            onChange: this.yesChanged }),
          React.createElement(
            'span',
            { className: 'label-body' },
            Locale.t('booleanInput.yes')
          )
        ),
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'radio',
            name: this.state.name,
            checked: this.state.value == false,
            onChange: this.noChanged }),
          React.createElement(
            'span',
            { className: 'label-body' },
            Locale.t('booleanInput.no')
          )
        ),
        React.createElement(
          'span',
          { className: 'validation-error' },
          this.props.error
        )
      )
    );
  }

});
var NumberInput = React.createClass({
  displayName: 'NumberInput',


  onChange: function (e) {
    var newVal = e.target.value;
    switch (this.props.type || 'integer') {
      case 'integer':
        newVal = parseInt(newVal, 10);
        break;
      case 'float':
        newVal = parseFloat(newVal);
        break;
      case 'percent':
        newVal = parseFloat(newVal) / 100.0;
        break;
      default:
        newVal = null;
        break;
    }
    if (!_.isNull(newVal)) {
      this.props.onChange(this.state.name, newVal);
      this.setState({ value: newVal });
    }
  },

  getInitialState: function () {
    return {
      name: this.props.name,
      value: this.props.value
    };
  },

  render: function () {
    if (this.props.hidden) return null;

    var className = 'u-full-width';
    if (this.props.error) className += ' validation-error';

    var valueDisplay = this.state.value;
    if (this.props.type == 'percent') valueDisplay = valueDisplay * 100;

    var rowClass = 'row row-input';
    if (this.props.even) rowClass += ' row-even';

    return React.createElement(
      'div',
      { className: rowClass },
      React.createElement(
        'div',
        { className: 'eight columns' },
        this.props.text || ''
      ),
      React.createElement(
        'div',
        { className: 'four columns' },
        React.createElement('input', { type: 'number',
          className: className,
          placeholder: this.props.placeholder || '',
          value: _.isNull(valueDisplay) ? '' : valueDisplay,
          step: this.props.step || "1",
          onChange: this.onChange }),
        React.createElement(
          'span',
          { className: 'validation-error' },
          this.props.error
        )
      )
    );
  }

});
var SelectInput = React.createClass({
  displayName: 'SelectInput',


  onChange: function (e) {
    var newVal = e.target.value;
    switch (this.props.type || 'integer') {
      case 'integer':
        newVal = parseInt(newVal, 10);
        break;
      case 'float':
        newVal = parseFloat(newVal);
        break;
      case 'percent':
        newVal = parseFloat(newVal, 10) / 100.0;
        break;
      case 'string':
        break;
      default:
        newVal = null;
        break;
    }
    if (!_.isNull(newVal)) {
      this.props.onChange(this.state.name, newVal);
      this.setState({ value: newVal });
    }
    this.props.onChange(this.state.name, newVal);
    this.setState({ value: newVal });
  },

  getInitialState: function () {
    return {
      name: this.props.name,
      value: this.props.value
    };
  },

  render: function () {
    if (this.props.hidden) return null;

    var self = this;

    var className = 'u-full-width';
    if (this.props.error) className += ' validation-error';

    var rowClass = 'row row-input';
    if (this.props.even) rowClass += ' row-even';

    var input = '';
    if (this.props.selectType == 'radio') {
      input = this.props.options.map(function (option) {
        return React.createElement(
          'label',
          { className: 'nobreak', key: option.value },
          React.createElement('input', { type: 'radio',
            name: self.state.name,
            value: option.value,
            checked: self.state.value == option.value,
            onChange: self.onChange }),
          React.createElement(
            'span',
            { className: 'label-body' },
            option.text
          )
        );
      });
    } else {
      input = React.createElement(
        'select',
        { className: className,
          value: this.state.value ? this.state.value : '',
          onChange: this.onChange },
        this.props.options.map(function (option) {
          return React.createElement(
            'option',
            { value: option.value, key: option.value },
            option.text
          );
        })
      );
    }
    return React.createElement(
      'div',
      { className: rowClass },
      React.createElement(
        'div',
        { className: 'eight columns' },
        this.props.text || ''
      ),
      React.createElement(
        'div',
        { className: 'four columns' },
        input,
        React.createElement(
          'span',
          { className: 'validation-error' },
          this.props.error
        )
      )
    );
  }
});
// Application Cache Status
// window.applicationCache.status
//  UNCACHED == 0
//  IDLE == 1
//  CHECKING == 2
//  DOWNLOADING == 3
//  UPDATEREADY == 4
//  OBSOLETE == 5


var AppReloader = React.createClass({
  displayName: 'AppReloader',


  handleClick: function (e) {
    if (window.applicationCache.swapCache) {
      window.applicationCache.swapCache();
    }
    window.location.reload(true);
  },

  interpretAppCacheState: function (e) {
    this.setState({ status: window.applicationCache.status });
  },

  componentDidMount: function () {

    // Check now
    window.applicationCache.addEventListener('updateready', this.interpretAppCacheState);

    // Check every 10 minutes for an updates
    setInterval(function () {
      window.applicationCache.update();
    }, 600000);

    this.interpretAppCacheState();
  },

  getInitialState: function () {
    return { status: null };
  },

  render: function () {
    if (this.state.status == window.applicationCache.UPDATEREADY) {
      return React.createElement(
        'div',
        { className: 'notification row install-update', onClick: this.handleClick },
        Locale.t('appReloader.updateAvailable')
      );
    }
    return null;
  }
});
var Application = React.createClass({
  displayName: 'Application',


  setLocale: function (locale) {
    Locale.setLocale(locale);
    this.setState({ locale: locale });
  },

  newReport: function () {
    if (this.state.mode == 'survey' && !this.state.survey.submitted) {
      if (!confirm(Locale.t('application.abandonConfirm'))) {
        return;
      }
    }
    this.setState(this.getDefaultState());
  },

  viewReport: function (survey) {
    this.setState({ mode: 'survey', survey: survey });
  },

  deleteReport: function (index) {
    this.appStorage().removeHistoryAt(index);
    this.forceUpdate();
  },

  reportHistory: function () {
    if (this.state.mode == 'survey' && !this.state.survey.submitted) {
      if (!confirm(Locale.t('application.abandonConfirm'))) {
        return;
      }
    }
    this.setState({ mode: 'reportHistory' });
  },

  appStorage: function () {
    if (!this._appStorage) this._appStorage = new AppStorage(this.props.namespace);
    return this._appStorage;
  },

  saveSurvey: function (survey) {
    this.appStorage().saveSurveyToHistory(survey);
  },

  storeActiveState: function (state) {
    this.appStorage().setState(state);
  },

  storeActiveSurvey: function (survey) {
    this.storeActiveState(_.extend(this.state, { survey: survey }));
  },

  componentDidUpdate: function () {
    window.scrollTo(0, 0);
    this.storeActiveState(this.state);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return true;
  },

  componentWillMount: function () {
    Locale.setLocale(this.state.locale || 'en-US');
  },

  getDefaultState: function () {
    return {
      survey: {
        inputs: CalculatorDefaults(),
        results: {},
        location: null,
        timestamp: new Date(),
        submitted: false,
        saved: false
      },
      locale: 'en-US',
      mode: 'survey'
    };
  },

  getInitialState: function () {
    var persistedState = this.appStorage().getState();
    return persistedState ? persistedState : this.getDefaultState();
  },

  render: function () {
    var currentApp = null;

    if (this.state.mode == 'survey') {
      currentApp = React.createElement(Survey, { key: this.state.survey.timestamp,
        survey: this.state.survey,
        storeActiveSurvey: this.storeActiveSurvey,
        saveSurvey: this.saveSurvey
      });
    } else if (this.state.mode == 'reportHistory') {
      currentApp = React.createElement(ReportHistory, {
        history: this.appStorage().getHistory(),
        viewReport: this.viewReport,
        deleteReport: this.deleteReport
      });
    }

    return React.createElement(
      'div',
      { 'class': 'main-container' },
      React.createElement(Navbar, { reportHistory: this.reportHistory,
        newReport: this.newReport,
        locale: this.state.locale,
        setLocale: this.setLocale }),
      React.createElement(
        'div',
        { className: 'application' },
        currentApp
      ),
      React.createElement(AppReloader, null)
    );
  }
});
/*
 * Because of the way that React currently protects against XSS, it uses
 * the cumbersome dangerouslySetInnerHTML for dynamic inner content.  This
 * component abstracts away that implementation so translations that need to
 * support markup in their content can include this span with html=html
 */
var MarkupSpan = React.createClass({
  displayName: "MarkupSpan",


  content: function () {
    return { __html: this.props.html };
  },

  render: function () {
    return React.createElement("span", { dangerouslySetInnerHTML: this.content() });
  }

});
var Navbar = React.createClass({
  displayName: "Navbar",


  toggleMenu: function (e, state) {
    var newState = typeof state === "undefined" ? !this.state.showMobileNav : state;
    this.setState({ showMobileNav: newState });
  },

  reportHistory: function (e) {
    this.toggleMenu(e, false);
    this.props.reportHistory();
  },

  newReport: function (e) {
    this.toggleMenu(e, false);
    this.props.newReport();
  },

  localeChanged: function (e) {
    e.preventDefault();
    this.props.setLocale(e.target.value);
  },

  getInitialState: function () {
    return {
      showMobileNav: false
    };
  },

  render: function () {
    var mobileNav = "";
    if (this.state.showMobileNav) {
      mobileNav = React.createElement(
        "div",
        { className: "mobilenav" },
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "button",
              { className: "button navbutton",
                onClick: this.reportHistory },
              Locale.t('navbar.pastReports')
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "button",
              { className: "button button-primary navbutton",
                onClick: this.newReport },
              Locale.t('navbar.newSurvey')
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "select",
              { value: this.props.locale, onChange: this.localeChanged },
              React.createElement(
                "option",
                { value: "en-US", key: "en-US" },
                "English"
              ),
              React.createElement(
                "option",
                { value: "es-ES", key: "es-ES" },
                "Espa\xF1ol"
              ),
              React.createElement(
                "option",
                { value: "fr-FR", key: "fr-FR" },
                "Fran\xE7ais"
              )
            )
          ),
          React.createElement(
            "li",
            null,
            "\xA0"
          )
        )
      );
    }

    var navClass = "navbar";
    if (this.state.showMobileNav) {
      navClass += " open";
    }

    return React.createElement(
      "nav",
      { className: navClass },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement("img", { className: "logo left", src: "img/smallLogo.png" }),
        React.createElement(
          "div",
          { className: "navbuttons desktop right" },
          React.createElement(
            "select",
            { value: this.props.locale, onChange: this.localeChanged },
            React.createElement(
              "option",
              { value: "en-US", key: "en-US" },
              "English"
            ),
            React.createElement(
              "option",
              { value: "es-ES", key: "es-ES" },
              "Espa\xF1ol"
            ),
            React.createElement(
              "option",
              { value: "fr-FR", key: "fr-FR" },
              "Fran\xE7ais"
            )
          ),
          "\xA0",
          React.createElement(
            "button",
            { className: "button navbutton",
              onClick: this.reportHistory },
            Locale.t('navbar.pastReports')
          ),
          "\xA0",
          React.createElement(
            "button",
            { className: "button button-primary navbutton",
              onClick: this.newReport },
            Locale.t('navbar.newSurvey')
          )
        ),
        React.createElement(
          "div",
          { onClick: this.toggleMenu,
            className: "mobile right menuToggle" },
          React.createElement("div", { className: "hamburger-menu", onClick: this.toggleMenu })
        ),
        React.createElement("div", { className: "u-cf" }),
        mobileNav
      )
    );
  }
});
var ReportHistory = React.createClass({
  displayName: 'ReportHistory',


  viewReport: function (index) {
    this.props.viewReport(this.props.history[index]);
  },

  deleteReport: function (index) {
    this.props.deleteReport(index);
  },

  render: function () {
    var self = this;
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h4',
        null,
        Locale.t('reportHistory.title')
      ),
      React.createElement(
        'table',
        { className: 'u-full-width' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              Locale.t('reportHistory.location')
            ),
            React.createElement(
              'th',
              null,
              Locale.t('reportHistory.recorder')
            ),
            React.createElement(
              'th',
              null,
              Locale.t('reportHistory.timeRecorded')
            ),
            React.createElement('th', { width: '1%;' })
          )
        ),
        React.createElement(
          'tbody',
          null,
          this.props.history.map(function (item, i) {
            return React.createElement(ReportHistoryRow, { report: item, key: i, index: i,
              viewReport: self.viewReport,
              deleteReport: self.deleteReport });
          })
        )
      )
    );
  }

});
var ReportHistoryRow = React.createClass({
  displayName: "ReportHistoryRow",


  view: function (e) {
    e.stopPropagation();
    this.props.viewReport(this.props.index);
  },

  delete: function (e) {
    e.stopPropagation();
    if (confirm(Locale.t('reportHistoryRow.deleteConfirm'))) {
      this.props.deleteReport(this.props.index);
    }
  },

  getFormattedDate: function () {
    var date = new Date(this.props.report.timestamp);
    return date.toLocaleString();
  },

  render: function () {
    return React.createElement(
      "tr",
      { className: "clickable", onClick: this.view },
      React.createElement(
        "td",
        null,
        this.props.report.location
      ),
      React.createElement(
        "td",
        null,
        this.props.report.recorder
      ),
      React.createElement(
        "td",
        null,
        this.getFormattedDate()
      ),
      React.createElement(
        "td",
        { className: "actions-column" },
        React.createElement(
          "button",
          { className: "button-primary desktop", onClick: this.view },
          Locale.t('reportHistoryRow.view')
        ),
        "\xA0",
        React.createElement(
          "button",
          { onClick: this.delete },
          Locale.t('reportHistoryRow.delete')
        )
      )
    );
  }

});