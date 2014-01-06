**My first dive into Node JS.**

Here Ill be posting code for various things involving Node JS or just Javascript in general. I am planning on learning as much Node JS and Javascript as I can over Winter Break 2013. My ultimate goal is to be able to use Node JS to connect a database with a REST api that can be accessed by various third party applications.


expressTest
--------------------------------------------------

The expressTest folder contains my test project that connects a local mongo db databse to a REST api using the express framework and the Mongoose mongo db wrapper library.

For now I am trying to make a simple api where users can create accounts and add songs to their playlist (By "songs" I mean url links to *.mp3* files).
Users can then either view all their songs at once or just view the next song in the playlist.
Ive implemented the playlist as a queue that loops over once it has dequeued all of its elements.
Internally, this queue is implemented with an array with an amortized constant time push (Double array size every time it fills up).
I chose to use arrays because it is a lot more efficient to use it than a linked list when dealing with MongoDB and Mongoose.
Arrays are built-in in the Mongoose library, so it makes for cleaner code too.

The features are quite simple:

	1. Allow for User registration and authentification
	2. Allow users to add songs to their library.
	3. Allow users to view all songs at once
	4. Allow users to see the next song on their looped playlist
	5. Allow users to selectively remove songs from their playlist
	6. Allow users to randomly shuffle the songs in their playlist.

So far all of these features have been implemented. As of now, I still need to do some code cleanup *(Its not very modular right now)*, do some testing, and include a bit of error handling.