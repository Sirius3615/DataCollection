# DataCollection

![Screenshot of DataCollection repository](/screenshot.png)

**DataCollection** is a simple Node.js server designed for local hosting that facilitates the collection of data for AI training. It automatically scrapes all text from `<p>` tags on a given website, cleans the text by removing unnecessary characters such as dots, apostrophes, and brackets, and then saves the clean data to a `text.txt` file.

This tool was specifically created to streamline data collection for training AI models. I use it to gather data on Croatia's history and general knowledge from Wikipedia.

I encourage contributions and feedback to help improve the codebase. If you have suggestions, please submit a pull request, or contact me via Discord (Ivan.#4912) or [email](ivan@beyondspacenews.com).

---

## Running & Using the server
Clone the repo from https://github.com/Sirius3615/DataCollection.git

Install all the NPM libs:
```
npm install
```

Run the server:
```
npm start
```
(either using the terminal or the IDE of choice)

Go to the endpoint:
```
http://localhost:3000/scrape
```
And scrape away!

---

## License

DataCollection is licensed under the [Unlicense](https://unlicense.org/), which means it is in the public domain and can be used freely without any licensing requirements.
