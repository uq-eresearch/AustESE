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
        "value": "//div[@class='obj'][h4/a='Demo artefact']//a[.='EDIT']"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "dupe-btn"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Artefacts"
      }
    },
    {
      "type": "verifyElementPresent",
      "locator": {
        "type": "xpath",
        "value": "//div[@class='obj'][h4/a='Demo artefact'][2]"
      }
    }
  ]
}