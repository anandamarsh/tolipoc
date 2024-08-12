import React, { useState } from "react";
import { Box, TextField, IconButton, CircularProgress, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatBot = () => {
    const [message, setMessage] = useState("");
    const [responses, setResponses] = useState([]); // Log of all responses
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        console.log("Message sent:", message);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:1979/api/get-response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: message }),
            });

            if (res.ok) {
                const data = await res.json();
                setResponses((prevResponses) => [
                    ...prevResponses,
                    { time: parseFloat(data.time), cost: parseFloat(data.cost) }, // Ensure data is a number
                ]);
                console.log("Response received:", data.response);
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error occurred while sending message:", error);
        }

        setLoading(false);
        setMessage("");
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    // Utility function to convert time to ##:##m format
    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}m`;
    };

    // Calculate the total time and cost (rounded to the nearest whole number)
    const totalTime = Math.round(responses.reduce((acc, curr) => acc + curr.time, 0));
    const totalCost = Math.round(responses.reduce((acc, curr) => acc + curr.cost, 0));

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    bottom: "1em",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "80%",
                    maxWidth: "800px",
                    borderRadius: "8px",
                    boxShadow: 3,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "0 1rem",
                    gap: "0.5rem",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                    }}
                >
                    <TextField
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        multiline
                        maxRows={5}
                        minRows={1}
                        fullWidth
                        placeholder="Enter your message"
                        sx={{
                            backgroundColor: "transparent",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                paddingRight: "3.5rem",
                                "& fieldset": {
                                    border: "none",
                                },
                            },
                            "& .MuiInputBase-input": {
                                color: "white",
                            },
                        }}
                    />
                    <IconButton
                        color="default"
                        onClick={handleSend}
                        disabled={loading}
                        sx={{
                            position: "absolute",
                            top: "50%",
                            right: "0",
                            transform: "translateY(-50%)", // Center button vertically
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            backgroundColor: loading ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.4)",
                            "&:hover": {
                                backgroundColor: loading ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.6)",
                            },
                            "& svg": {
                                color: "white", // Spinner color set to white
                                transition: "transform 0.5s linear",
                                transform: loading ? "rotate(360deg)" : "rotate(0deg)",
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    </IconButton>
                </Box>
            </Box>

            {/* Scrollable container for the stack of responses */}
            <Box
                sx={{
                    position: "fixed",
                    top: "1rem", // Stack touches the top of the page
                    bottom: "4rem", // Adjusted to leave more space for the total box
                    right: "1rem",
                    overflowY: "auto", // Enables vertical scrolling
                    maxHeight: "calc(100vh - 5rem)", // Adjusted to leave space for the input box
                    width: "10rem", // Adjust width automatically
                    maxWidth: "10rem", // Ensure the container stays within viewport width
                    display: "flex",
                    flexDirection: "column", // Stack the boxes in column order
                    alignItems: "flex-end", // Align items to the bottom of the container
                    justifyContent: "flex-end", // Start stacking from the bottom
                    gap: "0.5rem",
                    padding: "0.5rem 0",
                }}
            >
                {/* Render each individual response in a lighter box */}
                {responses.map((response, index) => (
                    <Box
                        key={index}
                        sx={{
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.6)", // Lighter color for individual responses
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                            whiteSpace: "nowrap", // Prevent text wrapping
                            overflow: "hidden", // Hide overflow
                            textOverflow: "ellipsis", // Show ellipsis if text is too long
                            width: "7rem", // Adjust width automatically
                            maxWidth: "7rem", // Ensure the container stays within viewport width
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            {formatTime(response.time)} - {response.cost}¢
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Render the total box at the bottom */}
            {responses.length > 0 && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: "1rem",
                        right: "1rem",
                        width: "7rem", // Adjust width automatically
                        maxWidth: "7rem", // Ensure the container stays within viewport width
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker color for total
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: 3,
                        whiteSpace: "nowrap", // Prevent text wrapping
                        overflow: "hidden", // Hide overflow
                        textOverflow: "ellipsis", // Show ellipsis if text is too long
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        {formatTime(totalTime)} - {totalCost}¢
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default ChatBot;
