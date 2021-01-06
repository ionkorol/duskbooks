import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { useCompUpdate } from "hooks";
import { AddressProp } from "utils/interfaces";

import styles from "./AddressForm.module.scss";

interface Props {
  title: string;
  onSubmit: () => any;
  setAddressInfo: Dispatch<SetStateAction<AddressProp>>;
  addressInfo: AddressProp;
  disabled: boolean;
  setAddressError: Dispatch<SetStateAction<AddressProp>>;
  addressError: AddressProp;
  // formRef: React.MutableRefObject<any>;
}

const AddressForm: React.FC<Props> = (props) => {
  const {
    addressInfo,
    setAddressInfo,
    setAddressError,
    addressError,
    title,
    onSubmit,
    disabled,
  } = props;

  const [formValidated, setFormValidated] = useState(true);

  useCompUpdate(() => {
    firstNameValidation();
  }, [addressInfo.firstName]);
  useCompUpdate(() => {
    lastNameValidation();
  }, [addressInfo.lastName]);
  useCompUpdate(() => {
    address1Validation();
  }, [addressInfo.address1]);
  useCompUpdate(() => {
    cityValidation();
  }, [addressInfo.city]);
  useCompUpdate(() => {
    stateValidation();
  }, [addressInfo.state]);
  useCompUpdate(() => {
    zipValidation();
  }, [addressInfo.zip]);
  useCompUpdate(() => {
    countryValidation();
  }, [addressInfo.country]);

  const firstNameValidation = () => {
    // Empty
    if (!addressInfo.firstName) {
      setAddressError((prevState) => ({
        ...prevState,
        firstName: "First Name Not Set!",
      }));
      return false;
    }
    setAddressError((prevState) => ({
      ...prevState,
      firstName: null,
    }));
    return true;
  };

  const lastNameValidation = () => {
    // Empty
    if (!addressInfo.lastName) {
      setAddressError((prevState) => ({
        ...prevState,
        lastName: "Last Name Not Set!",
      }));
      return false;
    }
    setAddressError((prevState) => ({
      ...prevState,
      lastName: null,
    }));
    return true;
  };

  const address1Validation = () => {
    // Empty
    if (!addressInfo.address1) {
      setAddressError((prevState) => ({
        ...prevState,
        address1: "Address Not Set!",
      }));
      return false;
    }
    setAddressError((prevState) => ({
      ...prevState,
      address1: null,
    }));
    return true;
  };

  const cityValidation = () => {
    // Empty
    if (!addressInfo.city) {
      setAddressError((prevState) => ({
        ...prevState,
        city: "City Not Set!",
      }));
      return false;
    }
    setAddressError((prevState) => ({
      ...prevState,
      city: null,
    }));
    return true;
  };

  const stateValidation = () => {
    // Empty
    if (!addressInfo.state) {
      setAddressError((prevState) => ({
        ...prevState,
        state: "State Not Set!",
      }));
      return false;
    }
    setAddressError((prevState) => ({
      ...prevState,
      state: null,
    }));
    return true;
  };

  const zipValidation = () => {
    // Empty
    if (!addressInfo.zip) {
      setAddressError((prevState) => ({
        ...prevState,
        zip: "Zip Code Not Set!",
      }));
      return false;
    }
    setAddressError((prevState) => ({
      ...prevState,
      zip: null,
    }));
    return true;
  };

  const countryValidation = () => {
    // Empty
    if (!addressInfo.country) {
      setAddressError((prevState) => ({
        ...prevState,
        country: "Country Not Set!",
      }));
      return false;
    }
    setAddressError((prevState) => ({
      ...prevState,
      country: null,
    }));
    return true;
  };

  useEffect(() => {
    if (
      addressError.firstName ||
      addressError.lastName ||
      addressError.address1 ||
      addressError.city ||
      addressError.state ||
      addressError.zip ||
      addressError.country
    ) {
      setFormValidated(false);
    } else {
      setFormValidated(true);
    }
  }, [
    addressError.firstName,
    addressError.lastName,
    addressError.address1,
    addressError.address2,
    addressError.city,
    addressError.state,
    addressError.zip,
    addressError.country,
  ]);

  const formValidation = () => {
    var result = true;

    // First Name
    result = firstNameValidation();

    // Last Name
    result = lastNameValidation();

    // Address 1
    result = address1Validation();

    // City
    result = cityValidation();

    // State
    result = stateValidation();

    // Zip Code
    result = zipValidation();

    // Country
    result = countryValidation();
    return result;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidation()) {
      onSubmit();
    }
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <h3>{title}</h3>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={addressInfo.firstName}
              onChange={(e) =>
                setAddressInfo((prevState) => ({
                  ...prevState,
                  firstName: e.target.value,
                }))
              }
              isInvalid={!!addressError.firstName}
              disabled={disabled}
              required
            />
            <Form.Control.Feedback type="invalid">
              {addressError.firstName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={addressInfo.lastName}
              onChange={(e) =>
                setAddressInfo((prevState) => ({
                  ...prevState,
                  lastName: e.target.value,
                }))
              }
              isInvalid={!!addressError.lastName}
              disabled={disabled}
              required
            />
            <Form.Control.Feedback type="invalid">
              {addressError.lastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          value={addressInfo.address1}
          onChange={(e) =>
            setAddressInfo((prevState) => ({
              ...prevState,
              address1: e.target.value,
            }))
          }
          isInvalid={!!addressError.address1}
          disabled={disabled}
          required
        />
        <Form.Control.Feedback type="invalid">
          {addressError.address1}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Address 2 (Optional)</Form.Label>
        <Form.Control
          type="text"
          value={addressInfo.address2}
          onChange={(e) =>
            setAddressInfo((prevState) => ({
              ...prevState,
              address2: e.target.value,
            }))
          }
          isInvalid={!!addressError.address2}
          disabled={disabled}
          required
        />
        <Form.Control.Feedback type="invalid">
          {addressError.address2}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={addressInfo.city}
              onChange={(e) =>
                setAddressInfo((prevState) => ({
                  ...prevState,
                  city: e.target.value,
                }))
              }
              isInvalid={!!addressError.city}
              disabled={disabled}
              required
            />
            <Form.Control.Feedback type="invalid">
              {addressError.city}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              as="select"
              value={addressInfo.state}
              onChange={(e) =>
                setAddressInfo((prevState) => ({
                  ...prevState,
                  state: e.target.value,
                }))
              }
              isInvalid={!!addressError.state}
              disabled={disabled}
              required
            >
              <option>Choose...</option>
              <option>Alabama</option>
              <option>Georgia</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {addressError.state}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="text"
              value={addressInfo.zip}
              onChange={(e) =>
                setAddressInfo((prevState) => ({
                  ...prevState,
                  zip: e.target.value,
                }))
              }
              isInvalid={!!addressError.zip}
              disabled={disabled}
              required
            />
            <Form.Control.Feedback type="invalid">
              {addressError.zip}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Group>
        <Form.Label>Country</Form.Label>
        <Form.Control
          as="select"
          value={addressInfo.country}
          onChange={(e) =>
            setAddressInfo((prevState) => ({
              ...prevState,
              country: e.target.value,
            }))
          }
          isInvalid={!!addressError.country}
          disabled={disabled}
          required
        >
          <option>Choose...</option>
          <option>United States</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {addressError.country}
        </Form.Control.Feedback>
      </Form.Group>
      <button type="submit" disabled={!formValidated}>
        Continue
      </button>
    </Form>
  );
};

export default AddressForm;
