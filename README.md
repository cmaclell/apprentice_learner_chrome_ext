Apprentice Chrome Extension
===========================

Description
-----------
This is a Google chrome extension that interfaces the Apprentice Learner
Architecture with arbitrary web pages. The extension works by injecting
listeners and a training interface onto webpages when it is active. The
listeners record user demonstrations, which are then passed to the Apprentice
Learner Architecture REST API (via localhost port 8000, currently). Additionally,
any actions from the architecture can be executed in the interface through
the extension. The user can then provide training feedback on these actions
through the provided training interface.

Currently, the extension is limited to reading and editing form elements. It
only perceives and listens to form elements. Its state representation is a
serialization of the web form. Also, its effectors can only manipulate form
elements. Extending these capabilities is a direction for future work.

Installation
------------
To install this extension open Google chrome:

    1. Navigate to the page: "chrome://extensions". 
    2. Click the "Load unpacked" button in the upper left.
    3. Select the Apprentice Chrome Extension directory (where this readme is)
    4. Double check that the extension appears on the list and is activated.

Using the Extension
-------------------
Before using this extension, you need to configure and create an Apprentice agent by doing the following:

    1. Open Google chrome
    2. Right click on the Apprentice chrome extension in the upper right of the browser bar
    3. Choose "options"
    4. Input the desired "Agent Type" and "Project Id" parameters for use with the Apprentice Learner Architecture
    5. Click "Create New Agent"

To use this extension:

    1. Navigate to a webpage with a form on it (sorry many web forms are not actually forms, so be aware).
    2. Click the Apprentice chrome extension button in the upper right of the browser bar.
    3. Set a task by inputing the name of the task in the "Set Task" input field and pressing "Set" (e.g., "solve problem").
    4. Train the agent by providing demonstrations and feedback when requested and using the buttons that appear in the "Training Actions" window in the lower right.
    5. When you think the agent is done with the task, use the "Task Complete" button that appears in the list of training actions. This will clear the current task.

Note, the agent will not do anything when it does not have a task set.


