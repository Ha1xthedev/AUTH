// Generate a random PlayFab ID
function generateRandomPlayFabId(customId) {
    var randomString = Math.random().toString(36).substring(2); // Generate a random alphanumeric string
    var timestamp = Date.now(); // Get the current timestamp in milliseconds

    return customId + "_" + randomString + "_" + timestamp;
}

// Define the CloudScript function for player authentication and display name setting
handlers.authenticateAndSetDisplayName = function (args) {
    var customId = args.customId;
    var displayName = args.displayName;

    // Generate a random and unique PlayFab ID for the player
    var generatedPlayFabId = generateRandomPlayFabId(customId);

    // Check if the player is already authenticated
    if (!server.IsPlayerLoggedIn({
        PlayFabId: generatedPlayFabId
    })) {
        // Player is not authenticated, so let's authenticate them
        var authenticationContext = {
            Id: customId, // Use the provided custom ID
            Type: "Custom"
        };

        var authResult = server.AuthenticateSession(
            authenticationContext,
            generatedPlayFabId
        );

        // Check if authentication was successful
        if (!authResult) {
            return {
                error: "Authentication failed."
            };
        }
    }

    // The player is now authenticated, let's set their display name
    var updateResult = server.UpdateUserReadOnlyData({
        PlayFabId: generatedPlayFabId,
        Data: {
            DisplayName: displayName
        }
    });

    if (updateResult) {
        // Get a session ticket for the authenticated player
        var sessionTicket = server.GetPlayerProfile({
            PlayFabId: generatedPlayFabId
        }).PlayerProfile.SessionTicket;

        return {
            result: "Display name set successfully.",
            sessionTicket: sessionTicket
        };
    } else {
        return {
            error: "Failed to set display name."
        };
    }
};
