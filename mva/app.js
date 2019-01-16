CalculatorDefaults = function () {
  return {
    monthsdelay: 0.25,
    frequency: 1
  };
};

MVACalculator = function (_inputs) {

  var defaultInputs = {
    mvaspermonth: 0, // page-2-MVAS-month
    dayspermonth: 0, // page-2-MVAS-days
    reorderfrequency: 'stockslow', // reorder-frequency
    frequency: 0, // page-2-frequency
    monthsdelay: 0 // page-2-delay
  };

  var inputs = _.extend(defaultInputs, _inputs);

  var outputs = {
    activestock: 0,
    minmachines: 0,
    maxmachines: 0,
    orderamount: 0,
    yearneeds: 0,
    interval: 0
  };

  // Order when stocks are low
  if (inputs.reorderfrequency == 'stockslow') {

    var multiplier = this.monthsdelay > 3 ? 2 : 3;
    outputs.minmachines = Math.round(inputs.monthsdelay * inputs.mvaspermonth / 25);
    outputs.maxmachines = Math.max(Math.round(multiplier * outputs.minmachines));

    outputs.orderamount = outputs.maxmachines - outputs.minmachines;

    var active = getTo95(inputs.mvaspermonth / inputs.dayspermonth);
    var extras = extrasf(active);
    outputs.activestock = active + extras;

    outputs.yearneeds = Math.round(inputs.mvaspermonth * 12 / 25);

    // Order according to a regular schedule
  } else if (inputs.reorderfrequency == 'regular') {

    var workload = inputs.frequency * inputs.mvaspermonth;

    var usage = workload / 25;
    outputs.minmachines = inputs.monthsdelay * inputs.mvaspermonth / 25;
    outputs.maxmachines = Math.ceil(usage + outputs.minmachines);

    var active = getTo95(inputs.mvaspermonth / inputs.dayspermonth);
    var extras = extrasf(active);
    outputs.activestock = active + extras;

    var yearload = 12 * inputs.mvaspermonth;
    outputs.yearneeds = Math.round(yearload / 25);
  }

  return outputs;
};
var MVASurveyForm = React.createClass({
  displayName: 'MVASurveyForm',


  getInitialState: function () {
    return {
      inputs: this.props.inputs,
      errors: {}
    };
  },

  componentDidUpdate: function () {
    this.props.storeActiveInputs(this.state.inputs);
  },

  submit: function (e) {
    e.preventDefault();
    if (this.validate()) {
      this.props.handleSurvey(this.state.inputs);
    }
  },

  validate: function () {
    var errors = {};
    var inputs = this.state.inputs;

    Validator.gteZero(errors, 'mvaspermonth', inputs.mvaspermonth);
    Validator.dayOfMonth(errors, 'dayspermonth', inputs.dayspermonth);
    Validator.selectOne(errors, 'reorderfrequency', inputs.reorderfrequency);

    this.setState({ errors: errors });
    return _.isEmpty(errors);
  },

  // Name

  inputChanged: function (name, value) {
    var newVals = {};
    newVals[name] = value;
    this.setState({ inputs: _.extend(this.state.inputs, newVals) });
  },

  render: function () {
    var inputs = this.state.inputs;
    var errors = this.state.errors;

    return React.createElement(
      'form',
      { className: 'survey', onSubmit: this.submit },
      React.createElement(
        'h2',
        null,
        Locale.t('mvaSurveyForm.title')
      ),
      React.createElement(MarkupSpan, { html: Locale.t('mvaSurveyForm.instructions') }),
      React.createElement(
        'h4',
        null,
        Locale.t('mvaSurveyForm.formHeader')
      ),
      React.createElement(NumberInput, { type: 'integer',
        name: 'mvaspermonth',
        value: inputs.mvaspermonth,
        onChange: this.inputChanged,
        error: errors.mvaspermonth,
        text: Locale.t('mvaSurveyForm.mvaspermonthText'),
        placeholder: Locale.t('mvaSurveyForm.mvaspermonthPlaceholder')
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'dayspermonth',
        value: inputs.dayspermonth,
        onChange: this.inputChanged,
        error: errors.dayspermonth,
        text: Locale.t('mvaSurveyForm.dayspermonthText'),
        placeholder: Locale.t('mvaSurveyForm.dayspermonthPlaceholder'),
        even: true
      }),
      React.createElement(SelectInput, { type: 'string',
        selectType: 'radio',
        name: 'reorderfrequency',
        value: inputs.reorderfrequency,
        onChange: this.inputChanged,
        error: errors.reorderfrequency,
        text: Locale.t('mvaSurveyForm.reorderfrequencyText'),
        options: [{ value: 'stockslow', text: Locale.t('mvaSurveyForm.reorderfrequencyStocksLow') }, { value: 'regular', text: Locale.t('mvaSurveyForm.reorderfrequencyRegular') }]
      }),
      React.createElement(SelectInput, { type: 'integer',
        hidden: inputs.reorderfrequency != 'regular',
        name: 'frequency',
        value: inputs.frequency,
        onChange: this.inputChanged,
        error: errors.frequency,
        text: Locale.t('mvaSurveyForm.frequencyText'),
        options: [{ value: 1, text: Locale.t('mvaSurveyForm.frequencyMonthly') }, { value: 2, text: Locale.t('mvaSurveyForm.frequency2Months') }, { value: 3, text: Locale.t('mvaSurveyForm.frequency3Months') }, { value: 4, text: Locale.t('mvaSurveyForm.frequency4Months') }, { value: 5, text: Locale.t('mvaSurveyForm.frequency5Months') }, { value: 6, text: Locale.t('mvaSurveyForm.frequency6Months') }]
      }),
      React.createElement(SelectInput, { type: 'float',
        name: 'monthsdelay',
        value: inputs.monthsdelay || 0.25,
        onChange: this.inputChanged,
        error: errors.monthsdelay,
        text: Locale.t('mvaSurveyForm.monthsdelayText'),
        options: [{ value: 0.25, text: Locale.t('mvaSurveyForm.monthsdelay1Week') }, { value: 0.5, text: Locale.t('mvaSurveyForm.monthsdelay2Weeks') }, { value: 0.75, text: Locale.t('mvaSurveyForm.monthsdelay3Weeks') }, { value: 1.0, text: Locale.t('mvaSurveyForm.monthsdelay4Weeks') }, { value: 1.25, text: Locale.t('mvaSurveyForm.monthsdelay5Weeks') }, { value: 1.5, text: Locale.t('mvaSurveyForm.monthsdelay6Weeks') }, { value: 1.75, text: Locale.t('mvaSurveyForm.monthsdelay7Weeks') }, { value: 2, text: Locale.t('mvaSurveyForm.monthsdelay2Months') }, { value: 3, text: Locale.t('mvaSurveyForm.monthsdelay3Months') }, { value: 4, text: Locale.t('mvaSurveyForm.monthsdelay4Months') }, { value: 5, text: Locale.t('mvaSurveyForm.monthsdelay5Months') }, { value: 6, text: Locale.t('mvaSurveyForm.monthsdelay6Months') }],
        even: true
      }),
      React.createElement(
        'div',
        { className: 'row row-input' },
        React.createElement(
          'div',
          { className: 'eight columns' },
          '\xA0'
        ),
        React.createElement(
          'div',
          { className: 'four columns' },
          React.createElement('input', { className: 'button-primary',
            type: 'submit',
            value: Locale.t('mvaSurveyForm.submit') })
        )
      )
    );
  }

});
var MVASurveyResults = React.createClass({
  displayName: 'MVASurveyResults',


  getInitialState: function () {
    return this.props.survey;
  },

  onLocationChange: function (e) {
    this.setState({ location: e.target.value });
  },

  onRecorderChange: function (e) {
    this.setState({ recorder: e.target.value });
  },

  saveSurvey: function (e) {
    e.preventDefault();
    if (this.state.location && this.state.recorder) {
      var newState = _.extend(this.state, { saved: true });
      delete newState.locationError; // Don't perist validation error for location
      delete newState.recorderError; // Don't perist validation error for recorder
      this.props.saveSurvey(newState);
      this.setState(newState);
    } else {
      if (!this.state.location) {
        this.setState({ locationError: Locale.t('mvaSurveyResults.locationError') });
      } else {
        this.setState({ locationError: null });
      }
      if (!this.state.recorder) {
        this.setState({ recorderError: Locale.t('mvaSurveyResults.recorderError') });
      } else {
        this.setState({ recorderError: null });
      }
    }
  },

  getSmsLink: function () {
    // Todo handle iOS sms link
    var message = Locale.m('mvaSurveyResults.smsReportMessage', this.state);
    if (navigator.userAgent.indexOf('iPhone') >= 0 || navigator.userAgent.indexOf('iPad') >= 0 || navigator.userAgent.indexOf('iPod') >= 0) {
      return "sms:&body=" + encodeURIComponent(message);
    } else {
      return "sms:?body=" + encodeURIComponent(message);
    }
  },
  getEmailLink: function () {
    var message = Locale.m('mvaSurveyResults.emailReportMessage', this.state);
    return "mailto:?subject=" + encodeURIComponent((this.state.location || "MVA aspirator stock") + " report") + "&body=" + encodeURIComponent(message);
  },

  render: function () {
    var saveButton = this.state.saved ? React.createElement(
      'span',
      null,
      Locale.t('mvaSurveyResults.reportSaved')
    ) : React.createElement(
      'button',
      { onClick: this.saveSurvey },
      Locale.t('mvaSurveyResults.saveReport')
    );

    var instructions = this.state.inputs.reorderfrequency == 'stockslow' ? React.createElement(MarkupSpan, { html: Locale.m('mvaSurveyResults.reorderFrequencyMessageStocksLow', this.state) }) : React.createElement(MarkupSpan, { html: Locale.m('mvaSurveyResults.reorderFrequencyMessageRegular', this.state) });

    var surveyResults = null;

    var locationClass = 'u-full-width';
    if (this.state.locationError) locationClass += " validation-error";
    var recorderClass = 'u-full-width';
    if (this.state.recorderError) recorderClass += " validation-error";

    return React.createElement(
      'form',
      { className: 'report-results' },
      React.createElement(
        'h4',
        null,
        Locale.t('mvaSurveyResults.title')
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'four columns' },
          React.createElement(
            'label',
            null,
            Locale.t('mvaSurveyResults.location')
          ),
          React.createElement('input', { className: locationClass,
            type: 'text',
            disabled: this.state.saved,
            onChange: this.onLocationChange,
            value: this.state.location,
            placeholder: Locale.t('mvaSurveyResults.locationPlaceholder') }),
          React.createElement(
            'span',
            { className: 'validation-error' },
            this.state.locationError
          )
        ),
        React.createElement(
          'div',
          { className: 'four columns' },
          React.createElement(
            'label',
            null,
            Locale.t('mvaSurveyResults.recorder')
          ),
          React.createElement('input', { className: recorderClass,
            type: 'text',
            disabled: this.state.saved,
            onChange: this.onRecorderChange,
            value: this.state.recorder,
            placeholder: Locale.t('mvaSurveyResults.recorderPlaceholder') }),
          React.createElement(
            'span',
            { className: 'validation-error' },
            this.state.recorderError
          )
        ),
        React.createElement(
          'div',
          { className: 'four columns' },
          React.createElement(
            'label',
            null,
            Locale.t('mvaSurveyResults.reportTime')
          ),
          React.createElement('input', { className: 'u-full-width',
            disabled: true,
            type: 'text',
            value: new Date(this.state.timestamp).toLocaleString() })
        )
      ),
      React.createElement(
        'div',
        { className: 'row row-control centertext' },
        saveButton
      ),
      React.createElement(
        'div',
        { className: 'row report-controls' },
        React.createElement(
          'div',
          { className: 'twelve columns' },
          React.createElement(
            'a',
            { href: this.getEmailLink(), className: 'button button-primary' },
            Locale.t('mvaSurveyResults.emailReport')
          ),
          '\xA0',
          React.createElement(
            'a',
            { href: this.getSmsLink(), className: 'button button-primary' },
            Locale.t('mvaSurveyResults.smsReport')
          )
        )
      ),
      React.createElement(
        'h5',
        null,
        Locale.t('mvaSurveyResults.activestockTitle')
      ),
      React.createElement(
        'div',
        { className: 'row row-output row-even' },
        React.createElement(
          'div',
          { className: 'ten columns' },
          React.createElement(MarkupSpan, { html: Locale.m('mvaSurveyResults.activestockMessage', this.state) })
        ),
        React.createElement(
          'div',
          { className: 'two columns result' },
          React.createElement(
            'em',
            null,
            this.state.results.activestock
          )
        )
      ),
      React.createElement(
        'h5',
        null,
        Locale.t('mvaSurveyResults.stockinstructionsTitle')
      ),
      React.createElement(
        'div',
        { className: 'row row-output row-even' },
        React.createElement(
          'div',
          { className: 'twelve columns important-instructions' },
          instructions
        )
      ),
      React.createElement(
        'h5',
        null,
        Locale.t('mvaSurveyResults.yearneedsTitle')
      ),
      React.createElement(
        'div',
        { className: 'row row-output row-even' },
        React.createElement(
          'div',
          { className: 'ten columns' },
          React.createElement(MarkupSpan, { html: Locale.m('mvaSurveyResults.yearneedsMessage', this.state) })
        ),
        React.createElement(
          'div',
          { className: 'two columns result' },
          React.createElement(
            'em',
            null,
            this.state.results.yearneeds
          )
        )
      )
    );
  }
});
var Survey = React.createClass({
  displayName: "Survey",


  getInitialState: function () {
    return this.props.survey;
  },

  handleSurvey: function (inputs) {
    var results = MVACalculator(inputs);
    this.setState({
      inputs: inputs,
      results: results,
      submitted: true
    });
  },

  storeActiveSurvey: function (survey) {
    this.props.storeActiveSurvey(survey || this.state);
  },

  storeActiveInputs: function (inputs) {
    this.storeActiveSurvey(_.extend(this.state, { inputs: inputs }));
  },

  saveSurvey: function (survey) {
    this.props.saveSurvey(survey);
  },

  // Scroll to top on re-render
  componentDidUpdate: function () {
    window.scrollTo(0, 0);
    this.storeActiveSurvey(this.state);
  },

  render: function () {
    if (this.state.submitted) {
      return React.createElement(MVASurveyResults, { survey: this.state, saveSurvey: this.saveSurvey });
    } else {
      return React.createElement(MVASurveyForm, { inputs: this.state.inputs,
        storeActiveInputs: this.storeActiveInputs,
        handleSurvey: this.handleSurvey
      });
    }
  }

});
document.addEventListener("DOMContentLoaded", function () {
  Locale.addLocaleValues(window.locales);
  window.app = ReactDOM.render(React.createElement(Application, { namespace: "mva" }), document.getElementById('main'));
}, false);