import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Paper,
    IconButton,
    FormHelperText,
    FormControlLabel,
    Switch,
    Autocomplete,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import PeopleIcon from "@mui/icons-material/People";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [isReturnTrip, setIsReturnTrip] = useState(false);
    const [passengers, setPassengers] = useState(1);
    const [showPassengerDetails, setShowPassengerDetails] = useState(false);
    const [passengerDetails, setPassengerDetails] = useState([]);

    const [errors, setErrors] = useState({});

    const availableDepartures = [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
        "San Antonio",
        "San Diego",
        "Dallas",
        "San Jose",
        "Austin",
        "Jacksonville",
        "Fort Worth",
        "Columbus",
        "San Francisco",
        "Charlotte",
        "Indianapolis",
        "Seattle",
        "Denver",
        "Washington",
        "Boston",
    ];

    const availableDestinations = [
        "London",
        "Tokyo",
        "Paris",
        "Berlin",
        "Toronto",
        "Barcelona",
        "Dubai",
        "Amsterdam",
        "Singapore",
        "Hong Kong",
        "Bangkok",
        "Sydney",
        "Istanbul",
        "Rome",
        "Lisbon",
        "Moscow",
        "Madrid",
        "Copenhagen",
        "Stockholm",
        "Oslo",
        "Zurich",
    ];

    const mealPreferences = [
        "Vegetarian",
        "Vegan",
        "Gluten-Free",
        "Halal",
        "Kosher",
        "Paleo",
        "Keto",
        "Mediterranean",
        "Indian",
        "Thai",
    ];

    const handlePassengerChange = (index, field, value) => {
        const newPassengerDetails = [...passengerDetails];
        newPassengerDetails[index][field] = value;
        setPassengerDetails(newPassengerDetails);
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!departure) newErrors.departure = "Departure is required.";
        if (!destination) newErrors.destination = "Destination is required.";
        if (!departureDate) newErrors.departureDate = "Departure Date is required.";
        if (isReturnTrip && !returnDate) newErrors.returnDate = "Return Date is required.";
        if (passengers < 0 || passengers > 10) newErrors.passengers = "Number of passengers must be between 0 and 10.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setShowPassengerDetails(true);
            setPassengerDetails(Array.from({ length: passengers }, () => ({ name: "", age: "", cuisine: "" })));
        }
    };

    const handleNext = () => {
        const newErrors = [];
        let valid = true;

        passengerDetails.forEach((passenger, index) => {
            if (!passenger.name) {
                newErrors[index] = "Name is required.";
                valid = false;
            } else {
                newErrors[index] = "";
            }
            if (passenger.age < 1 || passenger.age > 99) {
                newErrors[index] = "Age must be between 1 and 99.";
                valid = false;
            }
        });

        if (valid) {
            alert("Passenger details confirmed!"); // Implement your booking logic here
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(darkgrey, darkgrey)",
                padding: "0 20%",
            }}
        >
            <Paper style={{ padding: "30px", borderRadius: "20px", backgroundColor: "white", width: "80%" }}>
                <Typography variant="h4" gutterBottom>
                    Air Coupa
                </Typography>
                <hr style={{ margin: "1rem 0" }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} style={{ padding: "0 2rem", display: "flex", alignItems: "flex-end" }}>
                        <FormControl fullWidth margin="normal" error={!!errors.departure}>
                            <InputLabel>Departure</InputLabel>
                            <Select
                                value={departure}
                                onChange={(e) => {
                                    setDeparture(e.target.value);
                                    setErrors({ ...errors, departure: "" });
                                }}
                            >
                                {availableDepartures.map((city) => (
                                    <MenuItem key={city} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.departure}</FormHelperText>
                            <IconButton style={{ position: "absolute", marginLeft: "-40px" }}>
                                <FlightTakeoffIcon />
                            </IconButton>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ padding: "0 2rem", display: "flex", alignItems: "flex-end" }}>
                        <FormControl fullWidth margin="normal" error={!!errors.destination}>
                            <InputLabel>Destination</InputLabel>
                            <Select
                                value={destination}
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    setErrors({ ...errors, destination: "" });
                                }}
                            >
                                {availableDestinations.map((city) => (
                                    <MenuItem key={city} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.destination}</FormHelperText>
                            <IconButton style={{ position: "absolute", marginLeft: "-40px" }}>
                                <FlightLandIcon />
                            </IconButton>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ padding: "0 2rem", display: "flex", alignItems: "center" }}>
                        <IconButton style={{ marginRight: "10px" }}>
                            <ImportExportIcon />
                        </IconButton>
                        <FormControlLabel
                            control={<Switch checked={isReturnTrip} onChange={() => setIsReturnTrip(!isReturnTrip)} />}
                            label={isReturnTrip ? "Return Trip" : "One Way"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ padding: "0 2rem", display: "flex", alignItems: "flex-end" }}>
                        <FormControl fullWidth margin="normal" error={!!errors.passengers}>
                            <TextField
                                label="Passengers"
                                type="number"
                                inputProps={{ min: 0, max: 10 }}
                                value={passengers}
                                onChange={(e) => {
                                    setPassengers(Math.max(0, Math.min(10, e.target.value)));
                                    setErrors({ ...errors, passengers: "" });
                                }}
                                error={!!errors.passengers}
                                helperText={errors.passengers}
                                fullWidth
                                margin="normal"
                            />
                            <IconButton style={{ position: "absolute", marginLeft: "-40px" }}>
                                <PeopleIcon />
                            </IconButton>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ padding: "0 2rem", display: "flex", alignItems: "flex-end" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Departure Date"
                                value={departureDate}
                                onChange={(newValue) => {
                                    setDepartureDate(newValue);
                                    setErrors({ ...errors, departureDate: "" });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={!!errors.departureDate}
                                        helperText={errors.departureDate}
                                        fullWidth
                                        margin="normal"
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    {isReturnTrip && (
                        <Grid
                            item
                            xs={12}
                            sm={4}
                            style={{ padding: "0 2rem", display: "flex", alignItems: "flex-end" }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Return Date"
                                    value={returnDate}
                                    onChange={(newValue) => {
                                        setReturnDate(newValue);
                                        setErrors({ ...errors, returnDate: "" });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={!!errors.returnDate}
                                            helperText={errors.returnDate}
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    )}
                </Grid>
                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        Next
                    </Button>
                </div>
                {showPassengerDetails && (
                    <div style={{ marginTop: "2rem" }}>
                        {passengerDetails.map((passenger, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label={`Passenger ${index + 1} Name`}
                                        value={passenger.name}
                                        onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label={`Passenger ${index + 1} Age`}
                                        type="number"
                                        value={passenger.age}
                                        onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                                        fullWidth
                                        inputProps={{ min: 1, max: 99 }}
                                        style={{ width: "6rem" }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Autocomplete
                                        options={mealPreferences}
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => (
                                            <TextField {...params} label={`Passenger ${index + 1} Meal Preference`} />
                                        )}
                                        onChange={(event, newValue) =>
                                            handlePassengerChange(index, "cuisine", newValue)
                                        }
                                        value={passenger.cuisine}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </div>
                )}
            </Paper>
        </div>
    );
}

export default App;
