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
        "type": "xpath",
        "value": "//label[normalize-space(.)='Locked']"
      }
    },
    {
      "type": "setElementSelected",
      "locator": {
        "type": "id",
        "value": "locked"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "save-btn"
      }
    },
    {
      "type": "verifyElementAttribute",
      "locator": {
        "type": "id",
        "value": "source"
      },
      "attributeName": "readonly",
      "value": "true"
    }
  ]
}