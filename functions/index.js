// The Cloud functions from firebase SDK to create Cloud Functions and triggers
const functions = require('firebase-functions');

// Firebase Admin SDK to access the firebase realtime database
const admin = require('firebase-admin');
admin.initializeApp();

// Create an addMessage function that takes a text and saves it to a 
// RealTime database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {

	// Grab the original text
	const original = req.query.text;
	
	// Push the new message into a RealTime Database using the Firebase Admin SDK
	const snapshot = await admin.database().ref('/messages').push({original: original});
	
	// Redirect with 303 SEE OTHER to the url of the pushed object in the Firebase Console
	res.redirect(303, snapshot.ref.toString());

}); 

// Add the markUpperCaseFunction 

//Listens to new message sent to /messages/:pushId/original and create an 
// uppercase version of the message to /messages/:pushId/uppercase

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
	 .onCreate((snapshot, context) => {
		
		// Collect the original message that was added to the ReaLTime database
		const original = snapshot.val();
		
		// Log the current values to the console
		console.log('Uppercasing' + context.params.pushId, original);

		// Convert the original message to uppercase
		const uppercase = original.toUpperCase();

		// You must return a Promise when performing asynchronous tasks inside the Functions
		// such as writing to the Firebase RealTime Databases 
		// Setting the "uppercase" sibling in the RealTime database returns a Promise
		return snapshot.ref.parent.child('uppercase').set(uppercase);
	});


