//Copyright (c) 2018 Aidan Kelley

class Markov {
    constructor(text) {
        this.parse = this.parse.bind(this);
        this.random = this.random.bind(this);

        this.specialTokens = ["n't", "'s", "'ve", "'d"];
        this.specialTokens.sort((a, b) => {b.length - a.length});

        this.words = this.parse(text);
        this.wordsLower = this.words.map(word => word.toLowerCase());
    }

    parse(text) {
        const specialTokens = this.specialTokens;

        function matchToken() {
            for(let tokenIndex = 0; tokenIndex < specialTokens.length; tokenIndex++) {
                let token = specialTokens[tokenIndex];

                if(indexInTextEquals(text, index, token)) {
                    return token;
                }
            }

            return null;
        }

        function indexInTextEquals(text, index, string) {
            for(let i = 0; i < string.length; i++) {
                if(text.charAt(index + i) !== string.charAt(i)) {
                    return false;
                }
            }
            return true;
        }

        let words = Array();

        let index = 0, prevIndex = index, l = text.length;
        while(index < l) {
            let char = text.charAt(index);

            let token = matchToken();
            if (token) {
                words.push(text.substring(prevIndex, index), token);
                index = index + token.length;
                prevIndex = index;
            }
            else if (char === ' ') {
                if(prevIndex !== index) {
                    words.push(text.substring(prevIndex, index));
                }

                index++;

                //skip over the space
                prevIndex = index;
            }
            else if (('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z') || ('0' <= char && char <= '9')) {
                index++;
            }
            else {
                if(prevIndex !== index) {
                    words.push(text.substring(prevIndex, index))
                }
                words.push(char);
                index++;
                prevIndex = index;
                //there's no special token AND it's not alpha numeric
                //this means it should be split.
            }
        }
        if (prevIndex !== l) {
            words.push(text.substring(prevIndex, l));
        }
        return words;
    }


    random(start = "") {

        const findIndices = ((word) => {
            const lower = word.toLowerCase();
            let indices = [];
            for (let i = 0, l = this.wordsLower.length; i < l; i++) {
                if (this.wordsLower[i] === lower) {
                    indices.push(i);
                }
            }

            return indices;
        }).bind(this);


        function randomElement(arr) {
            let index = Math.floor(Math.random() * arr.length);
            return arr[index];
        }

        const isSpecial = ((word) => {
            let lower = word.toLowerCase();
            for(let i = 0; i < this.specialTokens.length; i++) {
                if (lower === this.specialTokens[i]) {
                    return true;
                }
            }
            return false;
        }).bind(this);

        function isAlphaNumeric(word) {
            for(let i = 0; i < word.length; i++) {
                let char = word.charAt(i);

                if(!(('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z') || ('0' <= char && char <= '9'))) {
                    return false;
                }
            }
            return true;
        }

        let output = start ? start : "";

        //do a loop
        //find the indices that match the previous word
        //choose a random index
        //set the word as random index + 1
        //add word to the text

        let word = start;
        let indices;

        if(typeof word === "undefined" || word === "") {
            word = "\n";
        }

        do {
            if(word === undefined) {
                break;
            }
            indices = findIndices(word);


            if(indices.length === 0) {
                break;
            }

            let count = 0, nextIndex = 0;
            do {
                nextIndex = randomElement(indices) + 1;
                count ++;
            } while(nextIndex >= this.words.length && count < 100);

            word = this.words[nextIndex];
            console.log(nextIndex);
            console.log(word);
            if(word === undefined) {
                break;
            }

            if(isSpecial(word)) {
                output += word;
            }
            else if(isAlphaNumeric(word)) {
                output += " " + word;
            }
            else {
                output += word;
            }

        } while(word !== "\n");

        return output;
    }

}

module.exports = Markov;