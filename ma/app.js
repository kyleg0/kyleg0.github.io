CalculatorDefaults = function () {
  return {
    dose9wksless: 4,
    dose9to13wks: 4,
    doseover13wks: 4,
    doseincomplete: 3
  };
};

MACalculator = function (_inputs) {

  var defaultInputs = {
    usemisoprostol: false,
    mifeavail: false,
    combipackused: false,
    case3month: 0,
    days: 0,
    numma: 0,
    pctcombipack: 0,
    pct9wksless: 0,
    pct9to13wks: 0,
    pct9over13wks: 0,
    pctincomplete: 0,
    dose9wksless: 4,
    dose9to13wks: 4,
    doseover13wks: 4,
    doseincomplete: 3,
    misoother: 0,
    leadtime: 0,
    mifeprice: 0,
    misoprice: 0,
    combipackprice: 0,
    pac3month: 0,
    pacdays: 0,
    pctpacma: 0
  };

  var inputs = _.extend(defaultInputs, _inputs);

  var outputs = {
    caseload: 0,
    maaseload: 0,
    mifeavgconsum: 0,
    misoavgconsum: 0,
    combipackavgconsum: 0,
    misonocombiavgconsum: 0,
    minmifestock: 0,
    maxmifestock: 0,
    minmisostock: 0,
    maxmisostock: 0,
    mincombipackstock: 0,
    maxcombipackstock: 0,
    minmifeinvest: 0,
    maxmifeinvest: 0,
    minmisoinvest: 0,
    maxmisoinvest: 0,
    mincombipackinvest: 0,
    maxcombipackinvest: 0,

    paccaseload: 0,
    pacmacaseload: 0,
    pacmisoavgconsum: 0,
    pacminmisostock: 0,
    pacmaxmisostock: 0,
    pacminmisoinvest: 0,
    pacmaxmisoinvest: 0
  };

  if (inputs.usemisoprostol) {

    outputs.caseload = inputs.case3month / (inputs.days * 3);
    outputs.macaseload = inputs.numma / (inputs.days * 3);

    if (inputs.mifeavail) {
      outputs.misonocombiavgconsum = outputs.macaseload * inputs.days * (inputs.dose9wksless * inputs.pct9wksless + (inputs.dose9to13wks + 8) * inputs.pct9to13wks + (inputs.doseover13wks + 8) * inputs.pct9over13wks + inputs.doseincomplete * inputs.pctincomplete) + inputs.misoother;
    } else {
      outputs.misonocombiavgconsum = outputs.macaseload * inputs.days * (inputs.dose9wksless * 2 * inputs.pct9wksless + (inputs.dose9to13wks + 8) * inputs.pct9to13wks + (inputs.doseover13wks + 8) * inputs.pct9over13wks + inputs.doseincomplete * inputs.pctincomplete) + inputs.misoother;
    }

    if (inputs.combipackused) {
      outputs.combipackavgconsum = (inputs.pct9wksless + inputs.pct9to13wks + inputs.pct9over13wks) * outputs.macaseload * inputs.days * inputs.pctcombipack;
      outputs.mifeavgconsum = (inputs.pct9wksless + inputs.pct9to13wks + inputs.pct9over13wks) * outputs.macaseload * inputs.days * (1 - inputs.pctcombipack);
      outputs.misoavgconsum = outputs.misonocombiavgconsum - 4 * outputs.combipackavgconsum;
    } else if (inputs.mifeavail) {
      outputs.mifeavgconsum = (inputs.pct9wksless + inputs.pct9to13wks + inputs.pct9over13wks) * outputs.macaseload * inputs.days;
      outputs.misoavgconsum = outputs.macaseload * inputs.days * (inputs.dose9wksless * inputs.pct9wksless + (inputs.dose9to13wks + 8) * inputs.pct9to13wks + (inputs.doseover13wks + 8) * inputs.pct9over13wks + inputs.doseincomplete * inputs.pctincomplete) + inputs.misoother;
    } else {
      outputs.misoavgconsum = outputs.macaseload * inputs.days * (inputs.dose9wksless * 2 * inputs.pct9wksless + (inputs.dose9to13wks + 8) * inputs.pct9to13wks + (inputs.doseover13wks + 8) * inputs.pct9over13wks + inputs.doseincomplete * inputs.pctincomplete) + inputs.misoother;
    }

    if (outputs.combipackavgconsum > 0) {
      outputs.mincombipackstock = outputs.combipackavgconsum + inputs.leadtime * 7 * outputs.combipackavgconsum / inputs.days;
      outputs.maxcombipackstock = 3 * outputs.combipackavgconsum;
    } else {
      outputs.mincombipackstock = 0;
      outputs.maxcombipackstock = 0;
    }

    if (outputs.mifeavgconsum > 0) {
      outputs.minmifestock = outputs.mifeavgconsum + inputs.leadtime * 7 * outputs.mifeavgconsum / inputs.days;
      outputs.maxmifestock = 3 * outputs.mifeavgconsum;
    } else {
      outputs.minmifestock = 0;
      outputs.maxmifestock = 0;
    }

    outputs.minmisostock = outputs.misoavgconsum + inputs.leadtime * 7 * outputs.misoavgconsum / inputs.days;

    if (inputs.combipackused) {
      outputs.maxmisostock = 3 * outputs.misoavgconsum;
    } else {
      outputs.maxmisostock = 3 * outputs.misonocombiavgconsum;

      // this?
      //maxmisostock = 3 * misonocombiavgconsum;

      // @todo - is this formula wrong?
      //maxmisostock = 3 * misoavgconsum;
    }

    if (outputs.minmifestock > 0) {
      outputs.minmifeinvest = inputs.mifeprice * outputs.minmifestock;
    } else {
      outputs.minmifeinvest = 0;
    }
    if (outputs.maxmifestock > 0) {
      outputs.maxmifeinvest = inputs.mifeprice * outputs.maxmifestock;
    } else {
      outputs.maxmifeinvest = 0;
    }

    outputs.mincombipackinvest = inputs.combipackprice * outputs.mincombipackstock;
    outputs.maxcombipackinvest = inputs.combipackprice * outputs.maxcombipackstock;

    outputs.minmisoinvest = inputs.misoprice * outputs.minmisostock;
    outputs.maxmisoinvest = inputs.misoprice * outputs.maxmisostock;
  } else {

    outputs.paccaseload = inputs.pac3month / (inputs.pacdays * 3);
    outputs.pacmacaseload = inputs.pac3month * inputs.pctpacma / (inputs.pacdays * 3);

    outputs.pacmisoavgconsum = outputs.pacmacaseload * inputs.pacdays * inputs.doseincomplete + inputs.misoother;

    outputs.pacminmisostock = outputs.pacmisoavgconsum + inputs.leadtime * 7 * outputs.pacmisoavgconsum / 31;
    outputs.pacmaxmisostock = 3 * outputs.pacmisoavgconsum;

    outputs.pacminmisoinvest = inputs.misoprice * outputs.pacminmisostock;
    outputs.pacmaxmisoinvest = inputs.misoprice * outputs.pacmaxmisostock;
  }

  return outputs;
};
var SurveyMiso = React.createClass({
  displayName: 'SurveyMiso',


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

    Validator.gteOne(errors, 'case3month', inputs.case3month);
    Validator.gteOne(errors, 'numma', inputs.numma);
    Validator.dayOfMonth(errors, 'days', inputs.days);
    Validator.boolean(errors, 'mifeavail', inputs.mifeavail);
    Validator.boolean(errors, 'combipackused', inputs.combipackused);

    Validator.percent(errors, 'pctcombipack', inputs.pctcombipack);
    Validator.percent(errors, 'pct9wksless', inputs.pct9wksless);
    Validator.percent(errors, 'pct9to13wks', inputs.pct9to13wks);
    Validator.percent(errors, 'pct9over13wks', inputs.pct9over13wks);
    Validator.percent(errors, 'pctincomplete', inputs.pctincomplete);

    var sum = inputs.pct9wksless + inputs.pct9to13wks + inputs.pct9over13wks + inputs.pctincomplete;
    if (sum < 0.999 || sum > 1.001) {
      errors.percentage = Locale.t('surveyMiso.percentageValidationError');
    }

    Validator.gteZero(errors, 'dose9wksless', inputs.dose9wksless);
    Validator.gteZero(errors, 'dose9to13wks', inputs.dose9to13wks);
    Validator.gteZero(errors, 'doseover13wks', inputs.doseover13wks);
    Validator.gteZero(errors, 'doseincomplete', inputs.doseincomplete);
    Validator.gteZero(errors, 'misoother', inputs.misoother);

    Validator.numWeeks(errors, 'leadtime', inputs.leadtime);
    Validator.price(errors, 'misoprice', inputs.misoprice);
    if (inputs.mifeavail) {
      Validator.price(errors, 'mifeprice', inputs.mifeprice);
    }
    if (inputs.combipackused) {
      Validator.price(errors, 'combipackprice', inputs.combipackprice);
    }

    this.setState({ errors: errors });
    return _.isEmpty(errors);
  },

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
        'p',
        null,
        Locale.t('surveyMiso.instructions')
      ),
      React.createElement(
        'h4',
        null,
        Locale.t('surveyMiso.title')
      ),
      React.createElement(NumberInput, { type: 'integer',
        name: 'case3month',
        value: inputs.case3month,
        onChange: this.inputChanged,
        error: errors.case3month,
        text: Locale.t('surveyMiso.case3monthText'),
        placeholder: Locale.t('surveyMiso.case3monthPlaceholder')
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'numma',
        value: inputs.numma,
        onChange: this.inputChanged,
        error: errors.numma,
        text: Locale.t('surveyMiso.nummaText'),
        placeholder: Locale.t('surveyMiso.nummaPlaceholder'),
        even: true
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'days',
        value: inputs.days,
        onChange: this.inputChanged,
        error: errors.days,
        text: Locale.t('surveyMiso.daysText'),
        placeholder: Locale.t('surveyMiso.daysPlaceholder')
      }),
      React.createElement(BooleanInput, { name: 'mifeavail',
        value: inputs.mifeavail,
        onChange: this.inputChanged,
        error: errors.mifeavail,
        text: Locale.t('surveyMiso.mifeavailText'),
        even: true
      }),
      React.createElement(BooleanInput, { name: 'combipackused',
        value: inputs.combipackused,
        onChange: this.inputChanged,
        error: errors.combipackused,
        text: Locale.t('surveyMiso.combipackusedText')
      }),
      React.createElement('hr', null),
      React.createElement(
        'h4',
        null,
        Locale.t('surveyMiso.proceduresTitle')
      ),
      React.createElement(NumberInput, { type: 'percent',
        name: 'pctcombipack',
        value: inputs.pctcombipack,
        onChange: this.inputChanged,
        error: errors.pctcombipack,
        text: Locale.t('surveyMiso.pctcombipackText'),
        placeholder: Locale.t('surveyMiso.pctcombipackPlaceholder')
      }),
      React.createElement(
        'div',
        { className: errors.percentage ? 'validation-error' : '' },
        React.createElement(NumberInput, { type: 'percent',
          name: 'pct9wksless',
          value: inputs.pct9wksless,
          onChange: this.inputChanged,
          error: errors.pct9wksless,
          text: Locale.t('surveyMiso.pct9wkslessText'),
          placeholder: Locale.t('surveyMiso.pct9wkslessPlaceholder'),
          even: true
        }),
        React.createElement(NumberInput, { type: 'percent',
          name: 'pct9to13wks',
          value: inputs.pct9to13wks,
          onChange: this.inputChanged,
          error: errors.pct9to13wks,
          text: Locale.t('surveyMiso.pct9to13wksText'),
          placeholder: Locale.t('surveyMiso.pct9to13wksPlaceholder')
        }),
        React.createElement(NumberInput, { type: 'percent',
          name: 'pct9over13wks',
          value: inputs.pct9over13wks,
          onChange: this.inputChanged,
          error: errors.pct9over13wks,
          text: Locale.t('surveyMiso.pct9over13wksText'),
          placeholder: Locale.t('surveyMiso.pct9over13wksPlaceholder'),
          even: true
        }),
        React.createElement(NumberInput, { type: 'percent',
          name: 'pctincomplete',
          value: inputs.pctincomplete,
          onChange: this.inputChanged,
          error: errors.pctincomplete,
          text: Locale.t('surveyMiso.pctincompleteText'),
          placeholder: Locale.t('surveyMiso.pctincompletePlaceholder')
        })
      ),
      React.createElement(
        'div',
        { className: 'righttext' },
        React.createElement(
          'span',
          { className: 'validation-error' },
          errors.percentage
        )
      ),
      React.createElement(NumberInput, { type: 'integer',
        name: 'misoother',
        value: inputs.misoother,
        onChange: this.inputChanged,
        error: errors.misoother,
        text: Locale.t('surveyMiso.misootherText'),
        placeholder: Locale.t('surveyMiso.misootherPlaceholder'),
        even: true
      }),
      React.createElement('hr', null),
      React.createElement(
        'h4',
        null,
        Locale.t('surveyMiso.regimensTitle')
      ),
      React.createElement(NumberInput, { type: 'integer',
        name: 'dose9wksless',
        value: inputs.dose9wksless,
        onChange: this.inputChanged,
        error: errors.dose9wksless,
        text: Locale.t('surveyMiso.dose9wkslessText'),
        placeholder: Locale.t('surveyMiso.dose9wkslessPlaceholder')
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'dose9to13wks',
        value: inputs.dose9to13wks,
        onChange: this.inputChanged,
        error: errors.dose9to13wks,
        text: Locale.t('surveyMiso.dose9to13wksText'),
        placeholder: Locale.t('surveyMiso.dose9to13wksPlaceholder'),
        even: true
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'doseover13wks',
        value: inputs.doseover13wks,
        onChange: this.inputChanged,
        error: errors.doseover13wks,
        text: Locale.t('surveyMiso.doseover13wksText'),
        placeholder: Locale.t('surveyMiso.doseover13wksPlaceholder')
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'doseincomplete',
        value: inputs.doseincomplete,
        onChange: this.inputChanged,
        error: errors.doseincomplete,
        text: Locale.t('surveyMiso.doseincompleteText'),
        placeholder: Locale.t('surveyMiso.doseincompletePlaceholder'),
        even: true
      }),
      React.createElement('hr', null),
      React.createElement(
        'h4',
        null,
        Locale.t('surveyMiso.procurementTitle')
      ),
      React.createElement(SelectInput, { type: 'integer',
        name: 'leadtime',
        value: inputs.leadtime,
        onChange: this.inputChanged,
        error: errors.leadtime,
        text: Locale.t('surveyMiso.leadtimeText'),
        options: [{ value: '', text: "" }, { value: 1, text: Locale.t('surveyMiso.leadtime1week') }, { value: 2, text: Locale.t('surveyMiso.leadtime2weeks') }, { value: 3, text: Locale.t('surveyMiso.leadtime3weeks') }, { value: 4, text: Locale.t('surveyMiso.leadtime4weeks') }, { value: 5, text: Locale.t('surveyMiso.leadtime5weeks') }]
      }),
      React.createElement(NumberInput, { type: 'float',
        name: 'misoprice',
        value: inputs.misoprice,
        onChange: this.inputChanged,
        error: errors.misoprice,
        text: Locale.t('surveyMiso.misopriceText'),
        placeholder: Locale.t('surveyMiso.misopricePlaceholder'),
        step: '0.01',
        even: true
      }),
      React.createElement(NumberInput, { type: 'float',
        name: 'mifeprice',
        value: inputs.mifeprice,
        onChange: this.inputChanged,
        error: errors.mifeprice,
        hidden: !inputs.mifeavail,
        text: Locale.t('surveyMiso.mifepriceText'),
        placeholder: Locale.t('surveyMiso.mifepricePlaceholder'),
        step: '0.01',
        even: true
      }),
      React.createElement(NumberInput, { type: 'float',
        name: 'combipackprice',
        value: inputs.combipackprice,
        onChange: this.inputChanged,
        error: errors.combipackprice,
        hidden: !inputs.combipackused,
        text: Locale.t('surveyMiso.combipackpriceText'),
        placeholder: Locale.t('surveyMiso.combipackpricePlaceholder'),
        step: '0.01'
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
            value: Locale.t('surveyMiso.submit') })
        )
      )
    );
  }
});
var SurveyNomiso = React.createClass({
  displayName: 'SurveyNomiso',


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
    if (this.validate()) this.props.handleSurvey(this.state.inputs);
  },

  validate: function () {
    var errors = {};
    var inputs = this.state.inputs;

    Validator.gteOne(errors, 'pac3month', inputs.pac3month);
    Validator.dayOfMonth(errors, 'pacdays', inputs.pacdays);
    Validator.percent(errors, 'pctpacma', inputs.pctpacma);
    Validator.gteOne(errors, 'doseincomplete', inputs.doseincomplete);
    Validator.gteZero(errors, 'misoother', inputs.misoother);
    Validator.numWeeks(errors, 'leadtime', inputs.leadtime);
    Validator.price(errors, 'misoprice', inputs.misoprice);

    this.setState({ errors: errors });
    return _.isEmpty(errors);
  },

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
        'p',
        null,
        Locale.t('surveyNomiso.instructions')
      ),
      React.createElement(
        'h4',
        null,
        Locale.t('surveyNomiso.title')
      ),
      React.createElement(NumberInput, { type: 'integer',
        name: 'pac3month',
        value: inputs.pac3month,
        onChange: this.inputChanged,
        error: errors.pac3month,
        text: Locale.t('surveyNomiso.pac3monthText'),
        placeholder: Locale.t('surveyNomiso.pac3monthPlaceholder')
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'pacdays',
        value: inputs.pacdays,
        onChange: this.inputChanged,
        error: errors.pacdays,
        text: Locale.t('surveyNomiso.pacdaysText'),
        placeholder: Locale.t('surveyNomiso.pacdaysPlaceholder'),
        even: true
      }),
      React.createElement(NumberInput, { type: 'percent',
        name: 'pctpacma',
        value: inputs.pctpacma,
        onChange: this.inputChanged,
        error: errors.pctpacma,
        text: Locale.t('surveyNomiso.pctpacmaText'),
        placeholder: Locale.t('surveyNomiso.pctpacmaPlaceholder')
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'doseincomplete',
        value: inputs.doseincomplete,
        onChange: this.inputChanged,
        error: errors.doseincomplete,
        text: Locale.t('surveyNomiso.doseincompleteText'),
        placeholder: Locale.t('surveyNomiso.doseincompletePlaceholder'),
        even: true
      }),
      React.createElement(NumberInput, { type: 'integer',
        name: 'misoother',
        value: inputs.misoother,
        onChange: this.inputChanged,
        error: errors.misoother,
        text: Locale.t('surveyNomiso.misootherText'),
        placeholder: Locale.t('surveyNomiso.misootherPlaceholder')
      }),
      React.createElement(
        'h4',
        null,
        Locale.t('surveyNomiso.procurementTitle')
      ),
      React.createElement(SelectInput, { type: 'integer',
        name: 'leadtime',
        value: inputs.leadtime,
        onChange: this.inputChanged,
        error: errors.leadtime,
        text: Locale.t('surveyNomiso.leadtimeText'),
        options: [{ value: '', text: "" }, { value: 1, text: Locale.t('surveyNomiso.leadtime1week') }, { value: 2, text: Locale.t('surveyNomiso.leadtime2weeks') }, { value: 3, text: Locale.t('surveyNomiso.leadtime3weeks') }, { value: 4, text: Locale.t('surveyNomiso.leadtime4weeks') }, { value: 5, text: Locale.t('surveyNomiso.leadtime5weeks') }]
      }),
      React.createElement(NumberInput, { type: 'float',
        name: 'misoprice',
        value: inputs.misoprice,
        onChange: this.inputChanged,
        error: errors.misoprice,
        text: Locale.t('surveyNomiso.misopriceText'),
        placeholder: Locale.t('surveyNomiso.misopricePlaceholder'),
        step: '0.01',
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
            value: Locale.t('surveyNomiso.submit') })
        )
      )
    );
  }
});
var SurveyResultsMiso = React.createClass({
  displayName: "SurveyResultsMiso",


  render: function () {
    var results = this.props.results;
    var inputs = this.props.inputs;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsMiso.caseloadTitle')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.caseloadText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.macaseload.toFixed(2)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsMiso.avgconsumTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsMiso.avgconsumDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.misoavgconsumText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.misoavgconsum.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output" + (inputs.mifeavail ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.mifeavgconsumText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.mifeavgconsum.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" + (inputs.combipackused ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.combipackavgconsumText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.combipackavgconsum.toFixed(0)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsMiso.minstockTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsMiso.minstockDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.minmisostockText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.minmisostock.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output" + (inputs.mifeavail ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.minmifestockText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.minmifestock.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" + (inputs.combipackused ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.mincombipackstockText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.mincombipackstock.toFixed(0)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsMiso.maxstockTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsMiso.maxstockDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.maxmisostockText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.maxmisostock.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output" + (inputs.mifeavail ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.maxmifestockText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.maxmifestock.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" + (inputs.combipackused ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.maxcombipackstockext')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.maxcombipackstock.toFixed(0)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsMiso.investTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsMiso.investDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.minmisoinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.minmisoinvest.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.maxmisoinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.maxmisoinvest.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" + (inputs.mifeavail ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.minmifeinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.minmifeinvest.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output" + (inputs.mifeavail ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.maxmifeinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.maxmifeinvest.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" + (inputs.combipackused ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.mincombipackinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.mincombipackinvest.toFixed(0)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output" + (inputs.combipackused ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsMiso.maxcombipackinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            results.maxcombipackinvest.toFixed(0)
          )
        )
      )
    );
  }

});
var SurveyResultsNomiso = React.createClass({
  displayName: "SurveyResultsNomiso",


  render: function () {
    var results = this.props.results;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsNomiso.paccaseloadTitle')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsNomiso.paccaseloadText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            formatFloat(results.paccaseload, 2)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsNomiso.maaseloadTitle')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsNomiso.maaseloadText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            formatFloat(results.pacmacaseload, 2)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsNomiso.pacmisoavgconsumTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsNomiso.pacmisoavgconsumDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsNomiso.pacmisoavgconsumText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            formatInt(results.pacmisoavgconsum)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsNomiso.pacminmisostockTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsNomiso.pacminmisostockDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsNomiso.pacminmisostockText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            formatInt(results.pacminmisostock)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsNomiso.pacmaxmisostockTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsNomiso.pacmaxmisostockDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsNomiso.pacmaxmisostockText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            formatInt(results.pacmaxmisostock)
          )
        )
      ),
      React.createElement(
        "h5",
        null,
        Locale.t('surveyResultsNomiso.pacmisoinvestTitle')
      ),
      React.createElement(
        "p",
        null,
        Locale.t('surveyResultsNomiso.pacmisoinvestDescription')
      ),
      React.createElement(
        "div",
        { className: "row row-output row-even" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsNomiso.pacminmisoinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            formatInt(results.pacminmisoinvest)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row row-output" },
        React.createElement(
          "div",
          { className: "ten columns" },
          Locale.t('surveyResultsNomiso.pacmaxmisoinvestText')
        ),
        React.createElement(
          "div",
          { className: "two columns result" },
          React.createElement(
            "em",
            null,
            formatInt(results.pacmaxmisoinvest)
          )
        )
      )
    );
  }

});
var Survey = React.createClass({
  displayName: "Survey",


  handleMisoprostol: function (usemisoprostol) {
    this.setState({ inputs: _.extend(this.state.inputs, {
        usemisoprostol: usemisoprostol
      }) });
  },

  handleSurvey: function (inputs) {
    var results = MACalculator(inputs);
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

  getInitialState: function () {
    return this.props.survey;
  },

  render: function () {
    if (this.state.submitted) {
      return React.createElement(SurveyResults, { survey: this.state, saveSurvey: this.saveSurvey });
    } else {
      if (this.state.inputs.usemisoprostol == null) {
        return React.createElement(SurveyPicker, { handleMisoprostol: this.handleMisoprostol });
      } else if (this.state.inputs.usemisoprostol) {
        return React.createElement(SurveyMiso, { inputs: this.state.inputs,
          storeActiveInputs: this.storeActiveInputs,
          handleSurvey: this.handleSurvey
        });
      } else {
        return React.createElement(SurveyNomiso, { inputs: this.state.inputs,
          storeActiveInputs: this.storeActiveInputs,
          handleSurvey: this.handleSurvey
        });
      }
    }
  }
});
var SurveyPicker = React.createClass({
  displayName: 'SurveyPicker',


  setMisoprostolTrue: function (e) {
    e.preventDefault();
    this.props.handleMisoprostol(true);
  },

  setMisoprostolFalse: function (e) {
    e.preventDefault();
    this.props.handleMisoprostol(false);
  },

  render: function () {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        Locale.t('surveyPicker.title')
      ),
      React.createElement(
        'p',
        null,
        Locale.t('surveyPicker.description')
      ),
      React.createElement('hr', null),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'six columns panel centertext clickable',
            onClick: this.setMisoprostolFalse },
          React.createElement(
            'p',
            null,
            React.createElement(MarkupSpan, { html: Locale.t('surveyPicker.noMiso') })
          ),
          React.createElement(
            'button',
            { className: 'button-primary', onClick: this.setMisoprostolFalse },
            Locale.t('surveyPicker.launch')
          )
        ),
        React.createElement(
          'div',
          { className: 'six columns panel centertext clickable',
            onClick: this.setMisoprostolTrue },
          React.createElement(
            'p',
            null,
            React.createElement(MarkupSpan, { html: Locale.t('surveyPicker.miso') })
          ),
          React.createElement(
            'button',
            { className: 'button-primary', onClick: this.setMisoprostolTrue },
            Locale.t('surveyPicker.launch')
          )
        )
      )
    );
  }

});
var SurveyResults = React.createClass({
  displayName: 'SurveyResults',


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
        this.setState({ locationError: Locale.t('surveyResults.locationError') });
      } else {
        this.setState({ locationError: null });
      }
      if (!this.state.recorder) {
        this.setState({ recorderError: Locale.t('surveyResults.recorderError') });
      } else {
        this.setState({ recorderError: null });
      }
    }
  },

  getSmsLink: function () {
    // Todo handle iOS sms link
    var message = this.state.inputs.usemisoprostol ? Locale.m('surveyResultsMiso.smsMessage', this.state) : Locale.m('surveyResultsNomiso.smsMessage', this.state);
    if (navigator.userAgent.indexOf("iPhone") >= 0 || navigator.userAgent.indexOf('iPad') >= 0 || navigator.userAgent.indexOf('iPod') >= 0) {
      return "sms:&body=" + encodeURIComponent(message);
    }
    return "sms:?body=" + encodeURIComponent(message);
  },
  getEmailLink: function () {
    var message = this.state.inputs.usemisoprostol ? Locale.m('surveyResultsMiso.emailMessage', this.state) : Locale.m('surveyResultsNomiso.emailMessage', this.state);
    return "mailto:?subject=" + encodeURIComponent((this.state.location || "MA stock") + " report") + "&body=" + encodeURIComponent(message);
  },

  render: function () {
    console.log(this.state);
    var saveButton = this.state.saved ? React.createElement(
      'span',
      null,
      Locale.t('surveyResults.reportSaved')
    ) : React.createElement(
      'button',
      { onClick: this.saveSurvey },
      Locale.t('surveyResults.saveReport')
    );

    var surveyResults = this.state.inputs.usemisoprostol ? React.createElement(SurveyResultsMiso, { results: this.state.results, inputs: this.state.inputs }) : React.createElement(SurveyResultsNomiso, { results: this.state.results });

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
        Locale.t('surveyResults.title')
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
            Locale.t('surveyResults.location')
          ),
          React.createElement('input', { className: locationClass,
            type: 'text',
            disabled: this.state.saved,
            onChange: this.onLocationChange,
            value: this.state.location,
            placeholder: Locale.t('surveyResults.locationPlaceholder') }),
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
            Locale.t('surveyResults.recorder')
          ),
          React.createElement('input', { className: recorderClass,
            type: 'text',
            disabled: this.state.saved,
            onChange: this.onRecorderChange,
            value: this.state.recorder,
            placeholder: Locale.t('surveyResults.recorderPlaceholder') }),
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
            Locale.t('surveyResults.reportTime')
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
            Locale.t('surveyResults.emailReport')
          ),
          '\xA0',
          React.createElement(
            'a',
            { href: this.getSmsLink(), className: 'button button-primary' },
            Locale.t('surveyResults.textReport')
          )
        )
      ),
      surveyResults
    );
  }

});
document.addEventListener("DOMContentLoaded", function () {
  Locale.addLocaleValues(window.locales);
  window.app = ReactDOM.render(React.createElement(Application, { namespace: "ma" }), document.getElementById('main'));
}, false);