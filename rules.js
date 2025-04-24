class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.show("You must come back after reaching the Cigar Galaxy, which you can only truly explore once you have learned the truth of our universe from a special book. To get back home, you must also collect enough Stardust. Good luck on your journey!");
        this.engine.addChoice("Begin the story");
        this.engine.stardust = false;
        this.engine.knowledge = 0;

    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }
}

class Location extends Scene {
    create(key) {
        this.locationKey = key;
        let locationData = this.engine.storyData.Locations[key]; 
        this.engine.show(locationData.Body);
        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice);      
            }
            for (let interaction of locationData.Interactions || []) {
                this.engine.addChoice(interaction.Text, interaction);
            }
        } 
    }

    handleChoice(choice) { //choice here refers to either choice or interaction
        if (!choice){
            return this.engine.gotoScene(End);
        }
        
        this.engine.show("&gt; "+choice.Text);
        if (choice.Target){
            const SceneClass = sceneMap[choice.Target] || Location;
            this.engine.gotoScene(SceneClass, choice.Target);
        } 
        if (choice.Gain){
            if (choice.Gain == "stardust"){
                if (this.engine.stardust == true){
                    this.engine.show("You've already picked up enough stardust! I guess you could pack a little extra.");
                } 
                else {
                    this.engine.stardust = true;
                    this.engine.show("Amazing work, you have enough fuel to get back to the Milky Way.");
                }
                this.engine.gotoScene(Location, "Andromeda");
            }

            if (choice.Gain == "book") {
                if (this.engine.knowledge >= 5) {
                    this.engine.show("You've already gleaned all the knowledge this book holds.");
                }
                else {
                    this.engine.gotoScene(BookScene, this.engine.knowledge);
                    
                }
            }
            
        }
         
    }
}

class BookScene extends Scene {
    create(knowledge) {
        this.engine.knowledge = knowledge;
        this.pages = this.engine.storyData.BookPages;
        if (knowledge == 5){
            this.engine.show("You have finished reading the book, you may leave this galaxy.");
            
            this.engine.addChoice("Explore Black Eye", "leave");
        }
        else if (knowledge > 0 ){
            this.engine.show("It looks like you did not complete the book, do you wish to continue reading?");
            this.engine.addChoice("Open Book", "open");
            this.engine.addChoice("Explore Black Eye", "leave");
            this.currentPage = knowledge;
        } else {
            this.engine.show("You have found a special book in your hands. You must read it thoroughly to successfully complete your task");

            //this.pages = this.engine.storyData.BookPages;
            
            this.currentPage = knowledge;
    
            this.engine.addChoice("Open Book", "open");
            this.engine.addChoice("Explore Black Eye", "leave");
        }
    }

    handleChoice(action){
        if (action == "open") {
            this.engine.show("You're on the verge of greath truth.");
            this.engine.addChoice("Read", "read");
            this.engine.addChoice("Close", "close");
        }
        if (action == "read") {
            const text = this.pages[this.currentPage] || "You've absorved every last morsel of knowledge.";
            this.engine.show(text);
            if (this.currentPage < this.pages.length){
                this.currentPage += 1;
            }
            this.engine.addChoice("Read", "read");
            this.engine.addChoice("Close", "close");
        }
        if(action == "close") {
            this.engine.gotoScene(BookScene, this.currentPage);
        }
        if (action == "leave") {
            this.engine.gotoScene(Location, "Black Eye");
        }
    }
}

class CigarLocation extends Location {
    handleChoice(choice) {
        if (choice.Target == "Large Magellanic Cloud") {
            return this.engine.gotoScene(Location, "Large Magellanic Cloud");
        }
        this.engine.show(choice.Text);
        
        const dots = [".", "..", "..."];

        const totalDelay = 500 * (dots.length + 1);

        
        dots.forEach((dot, i) => {
            setTimeout(() => this.engine.show(dot), 500 * (i + 1));
        });
        setTimeout(()=> {
            if (!this.engine.stardust) {
                this.engine.show("You have not collected enough stardust to fuel the trip home!");
            }
            if (this.engine.knowledge < 5) {
                this.engine.show("You lack the wisdom you traveled for.");
                console.log("hey.")
            }
            if (this.engine.stardust && this.engine.knowledge >= 5) {
                this.engine.show("You have succeeded in your quest to travel the galaxies and learn the truth of our universe. Many well wishes to you in your future journeys.");

            }
            //super.handleChoice(choice);

            }, totalDelay);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

const sceneMap = {
    "Milky Way":        Location,
    Andromeda:          Location,
    "Black Eye":        Location,
    "Large Magellanic Cloud": Location,
    Cigar:              CigarLocation,
    "Milky Way Home":   Location
  };

Engine.load(Start, 'myStory.json');