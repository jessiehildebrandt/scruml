// ScrUML
// scruml.js
// Team JJARS


// ----------
// Constants

const UI_STATES = {
    SELECT: "select",
    ADD: "add",
    CONNECT: "connect",
    REMOVE: "remove"
}


// ----------
// Global variables

var currentUIState = UI_STATES.SELECT;
var selectedElement = null;
var diagram = null;


// ---------
// Keyboard accelerator handling function

function handleKeys(keyEvent)
{

    // Menubar accelerators (Ctrl)
    if (keyEvent.ctrlKey)
    {
        switch (keyEvent.key)
        {
            case "n":
            menubarNewButtonClicked();
            break;

            case "l":
            menubarLoadButtonClicked();
            break;

            case "s":
            menubarSaveButtonClicked();
            break;
        }
    }

    // Toolbar accelerators (Alt)
    if (keyEvent.altKey)
    {
        switch (keyEvent.key)
        {
            case "s":
            document.getElementById("toolbar-select").click();
            break;

            case "a":
            document.getElementById("toolbar-add").click();
            break;

            case "c":
            document.getElementById("toolbar-connect").click();
            break;

            case "r":
            document.getElementById("toolbar-remove").click();
            break;
        }
    }

}

document.addEventListener("keyup", handleKeys);


// ---------
// Menubar button click event functions

function menubarNewButtonClicked(element)
{
    pywebview.api.newDiagramFile().then(function(){diagram.update();});
}

function menubarLoadButtonClicked(element)
{
    pywebview.api.loadDiagramFile().then(function(){diagram.update();});
}

function menubarSaveButtonClicked(element)
{
    pywebview.api.saveDiagramFile().then(function(){diagram.update();});
}


// ---------
// UML element click event functions

function elementClicked(element)
{
    switch (currentUIState)
    {
        case UI_STATES.SELECT:
        elementSelect(element);
        break;

        case UI_STATES.ADD:
        break;

        case UI_STATES.CONNECT:
        elementConnect(element);
        break;

        case UI_STATES.REMOVE:
        elementRemove(element);
        break;
    }
}

function elementSelect(element)
{

    changeSelection(element);
    // TODO: Loop through dictionary. For each key-value pair, append 2 input elements to propertiesList

}

function elementConnect(element)
{
    // if (element.className != "class")
    // {
    //     return;
    // }

    // if (selectedElement == null)
    // {
    //     selectedElement = element;
    //     highlightElement(element, "#FF00FF");
    //     return;
    // }

    // var classAName = selectedElement.textContent; // TODO: Get the actual class name from element
    // var classBName = element.textContent; // TODO: Get the actual class name from element
    // var relationshipName = prompt("Enter the relationship name (leave blank for no name):");
    // pywebview.api.addRelationship(classAName, classBName, relationshipName);
    // // TODO: Update/redraw diagram
}

function elementRemove(element)
{
    if (element == selectedElement)
    {
        clearSelection();
    }
    pywebview.api.removeClass(element.id()).then(function() { diagram.update(); });
}


// ----------
// Diagram canvas class add event function

function tryAddClass(event)
{

    if (currentUIState != UI_STATES.ADD)
    {
        return;
    }

    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var newClassName = prompt("Enter the name of the new class:");

    pywebview.api.addClass({"class_name": newClassName,
                            "x": x,
                            "y": y}).then(function(response) {
        if (response !== "")
        {
            alert(response);
        }
        diagram.update();
    });

}


// ----------
// Toolbar button click event function

function toolbarButtonClicked(element)
{
    switch (element.id)
    {
        case "toolbar-select":
        currentUIState = UI_STATES.SELECT;
        break;

        case "toolbar-add":
        currentUIState = UI_STATES.ADD;
        break;

        case "toolbar-connect":
        clearSelection();
        currentUIState = UI_STATES.CONNECT;
        break;

        case "toolbar-remove":
        currentUIState = UI_STATES.REMOVE;
        break;
    }
    document.querySelector("#toolbar a.selected").classList.remove("selected");
    element.classList.add("selected");
}


// ----------
// Selection functions

function clearSelection()
{
    if (selectedElement != null)
        document.querySelector("#diagram-canvas .selected").classList.remove("selected");
    selectedElement = null;
}

function changeSelection(element)
{
    clearSelection();
    element.addClass("selected");
    selectedElement = element;
}


// ----------
// Page initialization

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        diagram = new Diagram("diagram-canvas");
        diagram.update();
    }, 100);
});
