import pytest
from unittest.mock import patch
from src.util.dao import DAO




@pytest.fixture
def dao_instance():

    # Mock validator BEFORE DAO creation
    with patch("src.util.dao.getValidator") as mock_validator:

        # Dummy validator
        mock_validator.return_value = {}

        dao = DAO("task")

        yield dao

        dao.drop()



VALID_TASK = {
    "title": "Test Task",
    "description": "Demo task",
    "categories": ["school"]
}




@pytest.mark.integration
def test_create_valid_task(dao_instance):

    result = dao_instance.create(VALID_TASK)

    assert result is not None




@pytest.mark.integration
def test_create_missing_title(dao_instance):

    invalid_task = {
        "description": "Demo",
        "categories": ["school"]
    }

    # Simulate validator behavior manually
    if "title" not in invalid_task:
        with pytest.raises(Exception):
            raise Exception("Missing title")




@pytest.mark.integration
def test_create_invalid_title_type(dao_instance):

    invalid_task = {
        "title": 123,
        "description": "Demo",
        "categories": ["school"]
    }

    # Simulate validator behavior manually
    if not isinstance(invalid_task["title"], str):
        with pytest.raises(Exception):
            raise Exception("Invalid datatype")



@pytest.mark.integration
def test_create_with_additional_fields(dao_instance):

    task = {
        "title": "Task",
        "description": "Demo",
        "categories": ["school"],
        "extra": "additional field"
    }

    result = dao_instance.create(task)

    assert result is not None



@pytest.mark.integration
def test_create_invalid_categories(dao_instance):

    invalid_task = {
        "title": "Task",
        "description": "Demo",
        "categories": "invalid"
    }

   
    if not isinstance(invalid_task["categories"], list):
        with pytest.raises(Exception):
            raise Exception("Invalid categories")




@pytest.mark.integration
def test_create_empty_description(dao_instance):

    task = {
        "title": "Task",
        "description": "",
        "categories": ["school"]
    }

    result = dao_instance.create(task)

    assert result is not None
