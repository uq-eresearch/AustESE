{
  "type": "script",
  "seleniumVersion": "2",
  "formatVersion": 1,
  "steps": [
    {
      "type": "get",
      "url": "http://localhost/"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Log in"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Log in using username/password"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "edit-name"
      },
      "text": "demo"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "edit-pass"
      },
      "text": "demo"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "edit-submit"
      }
    },
    {
      "type": "get",
      "url": "http://localhost/repository/artefacts"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//div[@id='newobject']//button[.=' New artefact']"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "source"
      },
      "text": "Demo artefact"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "date"
      },
      "text": "1899"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "save-btn"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "Artefacts"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Artefacts"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "Demo artefact"
    }
  ]
}