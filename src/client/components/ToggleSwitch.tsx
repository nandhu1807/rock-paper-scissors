import React from 'react';
import PropTypes from 'prop-types';
import { Body, Switch, SwitchLabel, SwitchRadio, SwitchSelection } from './ToggleSwitch.Styles';

function ToggleSwitch(props: {
  selectedValue: string;
  handleChange: (toggleValue: string) => void;
}) {
  const toggleValues = ['P VS C', 'C VS C', 'P VS P'];

  function selectionStyle() {
    return {
      left: `${(toggleValues.indexOf(props.selectedValue) / 3) * 100}%`,
    };
  }

  return (
    <>
      <Body className={'toggle-switch-body'}>
        <Switch className={'toggle-switch'}>
          {toggleValues.map((value, index) => {
            return (
              <span key={index} className={'toggle-switch-span'}>
                <SwitchRadio
                  className={'toggle-switch-radio'}
                  type={'radio'}
                  name={'switch'}
                  checked={props.selectedValue === value}
                />
                <SwitchLabel
                  className={'toggle-switch-label'}
                  onClick={() => props.handleChange(value)}
                >
                  {value}
                </SwitchLabel>
              </span>
            );
          })}
          <SwitchSelection className={'toggle-switch-selection'} style={selectionStyle()} />
        </Switch>
      </Body>
    </>
  );
}

ToggleSwitch.propTypes = {
  selectedValue: PropTypes.string,
  handleChange: PropTypes.func,
};

export default ToggleSwitch;