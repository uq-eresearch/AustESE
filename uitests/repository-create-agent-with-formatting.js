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
      "url": "http://localhost/repository/agents"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "+ New agent"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "lastName"
      },
      "text": "A"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "firstName"
      },
      "text": "Person"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "biography"
      },
      "text": "A biography"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "biography"
      },
      "text": "A biography"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "save-btn"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Agents"
      }
    },
    {
      "type": "verifyTextPresent",
      "text": "A, PersonA biographyEDIT"
    }
  ]
}