///
/// ContactFields.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

/**
 * Represents the JS union `ContactFields`, backed by a C++ enum.
 */
public typealias ContactFields = margelo.nitro.utils.ContactFields

public extension ContactFields {
  /**
   * Get a ContactFields for the given String value, or
   * return `nil` if the given value was invalid/unknown.
   */
  init?(fromString string: String) {
    switch string {
      case "FIRST_NAME":
        self = .firstName
      case "LAST_NAME":
        self = .lastName
      case "PHONE_NUMBERS":
        self = .phoneNumbers
      case "EMAIL_ADDRESSES":
        self = .emailAddresses
      case "IMAGE_DATA":
        self = .imageData
      default:
        return nil
    }
  }

  /**
   * Get the String value this ContactFields represents.
   */
  var stringValue: String {
    switch self {
      case .firstName:
        return "FIRST_NAME"
      case .lastName:
        return "LAST_NAME"
      case .phoneNumbers:
        return "PHONE_NUMBERS"
      case .emailAddresses:
        return "EMAIL_ADDRESSES"
      case .imageData:
        return "IMAGE_DATA"
    }
  }
}
