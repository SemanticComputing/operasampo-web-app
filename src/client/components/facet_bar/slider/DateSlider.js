import React, { Component } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { Handle, Track, Tick, TooltipRail } from './SliderComponents'; // example render components - source below

const sliderStyle = {
  position: 'relative',
  width: '100%',
};

const defaultValues = [240, 360];

class Example extends Component {
  state = {
    domain: [100, 600],
    values: defaultValues.slice(),
    update: defaultValues.slice(),
    reversed: false,
  }

  onUpdate = update => {
    this.setState({ update });
  }

  onChange = values => {
    this.setState({ values });
  }

  setDomain = domain => {
    this.setState({ domain });
  }

  toggleReverse = () => {
    this.setState(prev => ({ reversed: !prev.reversed }));
  }

  render() {
    const {
      state: { domain, values, reversed },
    } = this;

    return (
      <div style={{ height: 150, width: '100%' }}>
        <Slider
          mode={1}
          step={1}
          domain={domain}
          reversed={reversed}
          rootStyle={sliderStyle}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
        >
          <Rail>{railProps => <TooltipRail {...railProps} />}</Rail>
          <Handles>
            {({ handles, activeHandleID, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    isActive={handle.id === activeHandleID}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={10}>
            {({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map(tick => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
    );
  }
}

export default Example;
