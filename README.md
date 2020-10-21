# Smart Home Simulator
This project is meant to be a Smart Home Simulator and was created for Concordia's SOEN 343 (Software Architecture and Design) Course, Section G. 
## Authors
Mansoureh Edalati - 40037283 (@Mansiedi1980)

Matthew Kevork - 40063824 (@matkev)

Pascal Demerdjian - 40096290 (@pascwhale)

Kevin Rao - 40095427 (@KevKevR)
## Technologies

Frontend

\- React.js (JavaScript Web Framework)

Backend

\- Javalin (Java Web Framework) 

\- Maven (Build Automation Tool)

Database

\- MongoDB 

Testing

\- JUnit 5
## Setup
### MongoDB
[Download](https://www.mongodb.com/try/download/community) and install MongoDB Community Server.
### OpenJDK 15
[Download](https://jdk.java.net/15/) and install OpenJDK 15.
### Maven
Step 1 - [Download](http://maven.apache.org/download.cgi) and install Maven using the Binary ZIP archive.

Step 2 - Create a `MAVEN_HOME` variable in the System Variables to store the main directory.

Step 3 - Add a '%MAVEN_HOME%\bin' variable to System PATH.

Step 4 - Confirm the installation using the `mvn -version` command in a terminal.
### Node.js
Step 1 - [Download](https://nodejs.org/en/) and install Node.js.

Step 2 - Confirm the installation using the `npm -version` command in a terminal.
### Visual Studio Code
Step 1: [Download](https://code.visualstudio.com/download) and install Visual Studio Code.

Step 2: [Download](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)  and install the Java extension pack from the Marketplace.

Step 3: Open the `settings.json` file for Visual Studio Code.

Depending on the platform, the user settings file is located in one of the directories listed below:

\-   Windows:  `%APPDATA%\Code\User\settings.json`

\-   macOS:  `$HOME/Library/Application Support/Code/User/settings.json`

\-  Linux:  `$HOME/.config/Code/User/settings.json`

Step 4: Add a `"java.home": "path/to/jdk-15"` entry to the JSON file with the folder path to the installation folder for OpenJDK 15.
## Run

Step 1: Clone the repository.

Step 2: Open a terminal inside the root directory.

Step 3: Run the `mvn clean install` command.

Step 4: Run the `mvn exec:java -Dexec.mainClass="Main"` command.

Step 5: Open a new terminal inside the `src/dashboard` directory.

Step 6: Run the `npm install` command.

Step 7: Run the `npm start` command.

Step 8: Open `localhost:3000` in a browser window to access the simulator.