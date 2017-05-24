import React, { Component, PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"
import _ from "lodash";

// More readable, just iterate over maps, only
const eachMap = (iterable, fn) => iterable.valueSeq().filter(Im.Map.isMap).map(fn)

export default class Parameters extends Component {

  static propTypes = {
    parameters: ImPropTypes.list.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    tryItOutEnabled: PropTypes.bool,
    allowTryItOut: PropTypes.bool,
    onTryoutClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    onChangeKey: PropTypes.array,
    pathMethod: PropTypes.array.isRequired
  }


  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    tryItOutEnabled: false,
    allowTryItOut: true,
    onChangeKey: [],
  }

  onChange = ( param, value, isXml ) => {
    let {
      specActions: { changeParam },
      onChangeKey,
    } = this.props

    changeParam( onChangeKey, param.get("name"), value, isXml)
  }

  onChangeConsumesWrapper = ( val ) => {
    let {
      specActions: { changeConsumesValue },
      onChangeKey
    } = this.props

    changeConsumesValue(onChangeKey, val)
  }

  getGroupByIn(parameters) {
    const params = parameters.toArray().map((e) => (e.toObject()))
    return _.groupBy(params, "in")
  }

  getTitleForType(name) {
    if (name === "header") {
      return "Headers"
    }

    if (name === "query") {
      return "Query Parameters"
    }

    if (name === "path") {
      return "Uri Parameters"
    }

    if (name === "body") {
      return "Body"
    }
  }

  render(){

    let {
      onTryoutClick,
      onCancelClick,
      parameters,
      allowTryItOut,
      tryItOutEnabled,

      fn,
      getComponent,
      specSelectors,
      pathMethod
    } = this.props

    const ParameterRow = getComponent("parameterRow")
    const isExecute = tryItOutEnabled && allowTryItOut
    const groups = this.getGroupByIn(parameters)
    const groupKeys = Object.keys(groups)

    return (
      <div className="opblock-section">
        { !parameters.count() ? <div className="opblock-description-wrapper"><p>No parameters</p></div> :
          <div className="table-container">
            <table className="parameters">
              <tbody>
                {
                  groupKeys.map((group) => {
                    const groupHeader = <div className="opblock-section-header"><h4>{this.getTitleForType(group)}</h4></div>
                    const params = groups[group]

                    return (
                      <div>
                        {groupHeader}
                        { params.map((param) => {
                          const parameter = Im.Map(param)

                          return (
                            <ParameterRow fn={ fn }
                              getComponent={ getComponent }
                              param={ parameter }
                              key={ parameter.get( "name" ) }
                              onChange={ this.onChange }
                              onChangeConsumes={this.onChangeConsumesWrapper}
                              specSelectors={ specSelectors }
                              pathMethod={ pathMethod }
                              parent={this}
                              isExecute={ isExecute }/>
                          )
                        })}
                      </div>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}


/*eachMap(parameters, (parameter) => (
  <ParameterRow fn={ fn }
    getComponent={ getComponent }
    param={ parameter }
    key={ parameter.get( "name" ) }
    onChange={ this.onChange }
    onChangeConsumes={this.onChangeConsumesWrapper}
    specSelectors={ specSelectors }
    pathMethod={ pathMethod }
    parent={this}
    isExecute={ isExecute }/>
)).toArray()*/
