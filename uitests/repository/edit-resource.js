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
      "url": "http://localhost/repository/resources"
    },
    {
      "type": "waitForTextPresent",
      "text": "No resources selected"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//span[.='demotranscri...']"
      }
    },
    {
      "type": "waitForElementPresent",
      "locator": {
        "type": "css selector",
        "value": ".x-item-selected"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//em[.='Send to']"
      }
    },
    {
      "type": "waitForElementPresent",
      "locator": {
        "type": "xpath",
        "value": "//span[.='Transcription editor']"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//a[span='Transcription editor']"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "Save New Version"
    },
    {
      "type": "storeEval",
      "script": "window.editor.cm.setValue(\"Demo transcription content\")",
      "variable": "setcontent"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "savebtn"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "Resource has been updated"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "View Resource"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "MD5 checksum"
    }
  ]
}