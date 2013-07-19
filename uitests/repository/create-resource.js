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
        "value": "//button[.='New']"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "name",
        "value": "filename"
      },
      "text": "demotranscription"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//button[.='OK']"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "demotranscri..."
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//span[.='demotranscri...']"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "0 bytes"
    }
  ]
}