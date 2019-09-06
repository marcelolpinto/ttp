import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
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
      borderBottom: `1px solid ${theme.colors.gray.main}`
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
 
  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };
 
  render() {
    const { classes } = this.props;

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes.wrapper}>
            <label>Address</label>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                console.log(suggestion);
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