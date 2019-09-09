import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
  wrapper: {
    marginTop: 2 * theme.unit,
    '& > input': {
      width: '100%',
      marginTop: theme.unit,
      padding: theme.unit,
      backgroundColor: theme.colors.gray.bg,
      boxShadow: 'none',
      border: 'none',
      borderBottom: `1px solid ${theme.colors.gray.main}`,
      '&:focus': {
        outline: 'none',
        borderBottom: `2px solid ${theme.colors.blue.main}`
      }
    }
  }
})
 
class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }
 
  handleChange = address => {
    this.setState({ address });
  };
 
  render() {
    const { classes, handleSelect, handleChange } = this.props;

    return (
      <PlacesAutocomplete
        value={this.props.value}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes.wrapper}>
            <label style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '.8rem' }}>Address</label>
            <input
              {...getInputProps({
                placeholder: 'Type address',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {
                loading &&
                <div style={{
                  padding: '8px',
                  backgroundColor: 'white',
                  borderRadius: '8px'
                }}>
                  Loading...
                </div>
              }
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { padding: '8px', fontWeight: 700, backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { padding: '8px', backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

LocationSearchInput = withStyles(styles)(LocationSearchInput);

export { LocationSearchInput };