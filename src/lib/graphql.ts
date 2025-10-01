/**
 * GraphQL Operations aligned with the updated schema (see schema.graphql).
 *
 * This file exposes:
 * - Generic GraphQL request helpers
 * - Query & mutation document strings
 * - Convenience wrapper functions for each operation
 *
 * NOTE:
 *  - origin_date / destination_date are optional on input (server may derive them),
 *    but returned TrackingPoint / TrackedBag types have them non-null.
 *  - Some legacy operations were removed from the schema (old tracking point config queries).
 *  - New concepts: JourneyConfig, damage reporting, image handling with ImageInput,
 *    extended bag/tracking point date fields, damage flags.
 */

/* ============================= */
/* GraphQL Operation Documents   */
/* ============================= */

/* -------- Journey Config -------- */
const QUERY_JOURNEY_CONFIG = `
  query getJourneyConfig($journey: String!) {
    getJourneyConfig(journey: $journey) {
      name
      origin {
        __typename
        ... on OriginDestinationBase {
          name
          origin_type
          icon
        }
        ... on SelectionList {
          name
          origin_type
          icon
          selection_list {
            name
            read_access
          }
        }
      }
      destination {
        __typename
        ... on OriginDestinationBase {
          name
          origin_type
          icon
        }
        ... on SelectionList {
          name
          origin_type
          icon
          selection_list {
            name
            read_access
          }
        }
      }
      tracking_points {
        __typename
        ... on TrackingPointConfigBase {
          type
          status
          status_name
          location
          flow {
            next_tracking_points
            is_initial
            vehicle_action
            no_of_images
          }
          read_access
          full_access
        }
        ... on UserTrackingPointConfig {
          type
          status
          status_name
          location
            ui {
              icon
              color
              text_color
              button_text
              category_text
            }
          flow {
            next_tracking_points
            is_initial
            vehicle_action
            no_of_images
          }
          read_access
          full_access
        }
      }
    }
  }
`;

/* -------- Menu Items -------- */
const QUERY_MENU_ITEMS = `
  query getMenuItems {
    getMenuItems {
      journey
      status
      category
      menu_item
      cognito_group
      ui {
        icon
        color
        text_color
        button_text
        category_text
      }
      flow {
        next_tracking_points
        is_initial
        vehicle_action
        no_of_images
      }
    }
  }
`;

/* -------- Sample Ten Bags (Testing) -------- */
const QUERY_TEN_BAGS = `
  query getTenBags {
    getTenBags {
      flight_no
      scheduled_date
      bag_tag_no
      bag_tag_last_five
      bag_status
      bag_journey
      last_process_ts
    }
  }
`;
/* -------- Tracking Point By Id -------- */
const QUERY_TRACKING_POINT_BY_ID = `
  query getTrackingPointById(
    $bag_tag_no: String!
    $tracking_point_id: String!
  ) {
    getTrackingPointById(
      bag_tag_no: $bag_tag_no
      tracking_point_id: $tracking_point_id
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images {
        name
        url
        type
      }
      additional_data
    }
  }
`;

/* -------- Tracking Points By Bag Tag No -------- */
const QUERY_TRACKING_POINTS_BY_BAG_TAG_NO = `
  query getTrackingPointsByBagTagNo(
    $bag_tag_no: String!
    $journey: String!
    $origin: String
    $origin_date: String
    $destination: String
    $destination_date: String
  ) {
    getTrackingPointsByBagTagNo(
      bag_tag_no: $bag_tag_no
      journey: $journey
      origin: $origin
      origin_date: $origin_date
      destination: $destination
      destination_date: $destination_date
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images {
        name
        url
        type
      }
      additional_data
    }
  }
`;

/* -------- Tracked Bags By Date -------- */
const QUERY_TRACKED_BAGS_BY_DATE = `
  query getTrackedBagsByDate($journey: String!, $date: String!) {
    getTrackedBagsByDate(journey: $journey, date: $date) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      origin_date
      destination
      destination_date
      vehicle_number
      additional_data
      damaged
      bag_images {
        name
        url
        type
      }
    }
  }
`;

/* -------- Tracked Bags (Batch) -------- */
const QUERY_TRACKED_BAGS = `
  query getTrackedBags($journey: String!, $bags: [BagInput!]) {
    getTrackedBags(journey: $journey, bags: $bags) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      origin_date
      destination
      destination_date
      vehicle_number
      additional_data
      damaged
      bag_images {
        name
        url
        type
      }
    }
  }
`;

/* -------- Tracked Bags By Bag Tag No (Multiple) -------- */
const QUERY_TRACKED_BAGS_BY_BAG_TAG_NO = `
  query getTrackedBagsByBagTagNo(
    $bag_tag_no: String!
    $journey: String!
    $origin: String
    $origin_date: String
    $destination: String
    $destination_date: String
  ) {
    getTrackedBagsByBagTagNo(
      bag_tag_no: $bag_tag_no
      journey: $journey
      origin: $origin
      origin_date: $origin_date
      destination: $destination
      destination_date: $destination_date
    ) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      origin_date
      destination
      destination_date
      vehicle_number
      additional_data
      damaged
      bag_images {
        name
        url
        type
      }
    }
  }
`;

/* -------- Tracked Bag By Bag Tag No (Single) -------- */
const QUERY_TRACKED_BAG_BY_BAG_TAG_NO = `
  query getTrackedBagByBagTagNo(
    $bag_tag_no: String!
    $journey: String!
    $origin: String
    $origin_date: String
    $destination: String
    $destination_date: String
  ) {
    getTrackedBagByBagTagNo(
      bag_tag_no: $bag_tag_no
      journey: $journey
      origin: $origin
      origin_date: $origin_date
      destination: $destination
      destination_date: $destination_date
    ) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      origin_date
      destination
      destination_date
      vehicle_number
      additional_data
      damaged
      bag_images {
        name
        url
        type
      }
    }
  }
`;

/* -------- Vehicle Query -------- */
const QUERY_VEHICLE = `
  query getVehicle($journey: String) {
    getVehicle(journey: $journey) {
      vehicle_number
      journey
    }
  }
`;

/* -------- Mutations -------- */

const MUTATION_START_TRACKING_POINT_JOURNEY = `
  mutation startTrackingPointJourney(
    $bag_tag_no: String!
    $journey: String!
    $status: String!
    $origin: String!
    $origin_date: String
    $destination: String!
    $destination_date: String
    $required_inputs: AWSJSON
  ) {
    startTrackingPointJourney(
      bag_tag_no: $bag_tag_no
      journey: $journey
      status: $status
      origin: $origin
      origin_date: $origin_date
      destination: $destination
      destination_date: $destination_date
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_GENERATE_BAG_ID = `
  mutation generateBagId(
    $journey: String!
    $status: String!
    $required_inputs: AWSJSON
  ) {
    generateBagId(
      journey: $journey
      status: $status
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_SAVE_TRACKING_POINT = `
  mutation saveTrackingPoint(
    $journey: String!
    $status: String!
    $bag_tag_no: String!
    $origin: String
    $origin_date: String
    $destination: String
    $destination_date: String
    $vehicle_number: String
    $images: [ImageInput!]
    $required_inputs: AWSJSON
  ) {
    saveTrackingPoint(
      journey: $journey
      status: $status
      bag_tag_no: $bag_tag_no
      origin: $origin
      origin_date: $origin_date
      destination: $destination
      destination_date: $destination_date
      vehicle_number: $vehicle_number
      images: $images
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_SAVE_TRACKING_POINT_FOR_MULTIPLE_BAGS = `
  mutation saveTrackingPointForMultipleBags(
    $journey: String!
    $status: String!
    $bags: [BagInput!]
    $required_inputs: AWSJSON
  ) {
    saveTrackingPointForMultipleBags(
      journey: $journey
      status: $status
      bags: $bags
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_REVERT_TRACKING_POINT = `
  mutation revertTrackingPoint(
    $bag_tag_no: String!
    $tracking_point_id: String!
  ) {
    revertTrackingPoint(
      bag_tag_no: $bag_tag_no
      tracking_point_id: $tracking_point_id
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_MASS_UPDATE_TRACKING_POINT_STATUS = `
  mutation massUpdateTrackingPointStatus(
    $journey: String!
    $status: String!
    $new_status: String!
  ) {
    massUpdateTrackingPointStatus(
      journey: $journey
      status: $status
      new_status: $new_status
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_UPDATE_TRACKING_POINT_STATUS_REMOVED = `
  mutation updateTrackingPointStatusRemoved(
    $bag_tag_no: String!
    $journey: String!
    $origin: String
    $origin_date: String
    $destination: String
    $destination_date: String
  ) {
    updateTrackingPointStatusRemoved(
      bag_tag_no: $bag_tag_no
      journey: $journey
      origin: $origin
      origin_date: $origin_date
      destination: $destination
      destination_date: $destination_date
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_SAVE_BAG_IMAGES = `
  mutation saveBagImages($bag_images: [BagImageInput!]) {
    saveBagImages(bag_images: $bag_images) {
      name
      url
      type
    }
  }
`;

const MUTATION_SAVE_DAMAGED_BAG_IMAGES = `
  mutation saveDamagedBagImages($bag_images: [BagImageInput!]) {
    saveDamagedBagImages(bag_images: $bag_images) {
      name
      url
      type
    }
  }
`;

const MUTATION_SAVE_VEHICLE = `
  mutation saveVehicle($vehicle_number: String!, $journey: String) {
    saveVehicle(vehicle_number: $vehicle_number, journey: $journey) {
      vehicle_number
      journey
    }
  }
`;

const MUTATION_SAVE_TRACKING_POINTS_FOR_BAGS_ON_VEHICLE = `
  mutation saveTrackingPointsForBagsOnVehicle(
    $vehicle_number: String!
    $journey: String!
    $status: String!
  ) {
    saveTrackingPointsForBagsOnVehicle(
      vehicle_number: $vehicle_number
      journey: $journey
      status: $status
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

const MUTATION_UPDATE_TRACKED_BAG = `
  mutation updateTrackedBag($bag: TrackedBagInput!) {
    updateTrackedBag(bag: $bag) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      origin_date
      destination
      destination_date
      vehicle_number
      additional_data
      damaged
      bag_images {
        name
        url
        type
      }
    }
  }
`;

const MUTATION_REPORT_DAMAGE_BAG = `
  mutation reportDamageBag(
    $bag_tag_no: String!
    $journey: String!
    $images: [ImageInput!]
    $damage_description: String!
    $location: String!
    $origin: String
    $origin_date: String
    $destination: String
    $destination_date: String
  ) {
    reportDamageBag(
      bag_tag_no: $bag_tag_no
      journey: $journey
      images: $images
      damage_description: $damage_description
      location: $location
      origin: $origin
      origin_date: $origin_date
      destination: $destination
      destination_date: $destination_date
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      origin_date
      destination
      destination_date
      vehicle_action
      vehicle_number
      tracked_by
      damaged
      bag_images { name url type }
      additional_data
    }
  }
`;

/* ============================= */
/* Generic Request Helper        */
/* ============================= */

async function executeGraphQLRequest<T>(
    endpoint: string,
    apiKey: string,
    query: string,
    variables?: Record<string, unknown>,
): Promise<T> {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const json = await response.json();
    if (json.errors?.length) {
        throw new Error(json.errors[0].message);
    }
    return json as T;
}

/* ============================= */
/* Query Wrapper Functions       */
/* ============================= */

export function getJourneyConfig(
    endpoint: string,
    apiKey: string,
    journey: string,
) {
    return executeGraphQLRequest(endpoint, apiKey, QUERY_JOURNEY_CONFIG, {
        journey,
    });
}

export function getMenuItems(endpoint: string, apiKey: string) {
    return executeGraphQLRequest(endpoint, apiKey, QUERY_MENU_ITEMS);
}

export function getTrackingPointById(
    endpoint: string,
    apiKey: string,
    bag_tag_no: string,
    tracking_point_id: string,
) {
    return executeGraphQLRequest(endpoint, apiKey, QUERY_TRACKING_POINT_BY_ID, {
        bag_tag_no,
        tracking_point_id,
    });
}

export function getTrackingPointsByBagTagNo(
    endpoint: string,
    apiKey: string,
    bag_tag_no: string,
    journey: string,
    origin?: string,
    origin_date?: string,
    destination?: string,
    destination_date?: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        QUERY_TRACKING_POINTS_BY_BAG_TAG_NO,
        {
            bag_tag_no,
            journey,
            origin,
            origin_date,
            destination,
            destination_date,
        },
    );
}

export function getTrackedBagsByDate(
    endpoint: string,
    apiKey: string,
    journey: string,
    date: string,
) {
    return executeGraphQLRequest(endpoint, apiKey, QUERY_TRACKED_BAGS_BY_DATE, {
        journey,
        date,
    });
}

export function getTrackedBags(
    endpoint: string,
    apiKey: string,
    journey: string,
    bags: Array<{
        bag_tag_no: string;
        origin?: string;
        origin_date?: string;
        destination?: string;
        destination_date?: string;
        vehicle_number?: string;
    }>,
) {
    return executeGraphQLRequest(endpoint, apiKey, QUERY_TRACKED_BAGS, {
        journey,
        bags,
    });
}

export function getTrackedBagsByBagTagNo(
    endpoint: string,
    apiKey: string,
    bag_tag_no: string,
    journey: string,
    origin?: string,
    origin_date?: string,
    destination?: string,
    destination_date?: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        QUERY_TRACKED_BAGS_BY_BAG_TAG_NO,
        {
            bag_tag_no,
            journey,
            origin,
            origin_date,
            destination,
            destination_date,
        },
    );
}

export function getTrackedBagByBagTagNo(
    endpoint: string,
    apiKey: string,
    bag_tag_no: string,
    journey: string,
    origin?: string,
    origin_date?: string,
    destination?: string,
    destination_date?: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        QUERY_TRACKED_BAG_BY_BAG_TAG_NO,
        {
            bag_tag_no,
            journey,
            origin,
            origin_date,
            destination,
            destination_date,
        },
    );
}

export function getVehicle(endpoint: string, apiKey: string, journey?: string) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        QUERY_VEHICLE,
        journey ? { journey } : {},
    );
}

/* ============================= */
/* Mutation Wrapper Functions    */
/* ============================= */

export function startTrackingPointJourney(
    endpoint: string,
    apiKey: string,
    bag_tag_no: string,
    journey: string,
    status: string,
    origin: string,
    destination: string,
    origin_date?: string,
    destination_date?: string,
    required_inputs?: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_START_TRACKING_POINT_JOURNEY,
        {
            bag_tag_no,
            journey,
            status,
            origin,
            origin_date,
            destination,
            destination_date,
            required_inputs,
        },
    );
}

export function generateBagId(
    endpoint: string,
    apiKey: string,
    journey: string,
    status: string,
    required_inputs?: string,
) {
    return executeGraphQLRequest(endpoint, apiKey, MUTATION_GENERATE_BAG_ID, {
        journey,
        status,
        required_inputs,
    });
}

export function saveTrackingPoint(
    endpoint: string,
    apiKey: string,
    journey: string,
    status: string,
    bag_tag_no: string,
    origin?: string,
    origin_date?: string,
    destination?: string,
    destination_date?: string,
    vehicle_number?: string,
    images?: Array<{ name: string; type: string }>,
    required_inputs?: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_SAVE_TRACKING_POINT,
        {
            journey,
            status,
            bag_tag_no,
            origin,
            origin_date,
            destination,
            destination_date,
            vehicle_number,
            images,
            required_inputs,
        },
    );
}

export function saveTrackingPointForMultipleBags(
    endpoint: string,
    apiKey: string,
    journey: string,
    status: string,
    bags: Array<{
        bag_tag_no: string;
        origin?: string;
        origin_date?: string;
        destination?: string;
        destination_date?: string;
        vehicle_number?: string;
    }>,
    required_inputs?: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_SAVE_TRACKING_POINT_FOR_MULTIPLE_BAGS,
        { journey, status, bags, required_inputs },
    );
}

export function revertTrackingPoint(
    endpoint: string,
    apiKey: string,
    bag_tag_no: string,
    tracking_point_id: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_REVERT_TRACKING_POINT,
        { bag_tag_no, tracking_point_id },
    );
}

export function massUpdateTrackingPointStatus(
    endpoint: string,
    apiKey: string,
    journey: string,
    status: string,
    new_status: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_MASS_UPDATE_TRACKING_POINT_STATUS,
        { journey, status, new_status },
    );
}

export function updateTrackingPointStatusRemoved(
    endpoint: string,
    apiKey: string,
    bag_tag_no: string,
    journey: string,
    origin?: string,
    origin_date?: string,
    destination?: string,
    destination_date?: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_UPDATE_TRACKING_POINT_STATUS_REMOVED,
        {
            bag_tag_no,
            journey,
            origin,
            origin_date,
            destination,
            destination_date,
        },
    );
}

export function saveBagImages(
    endpoint: string,
    apiKey: string,
    bag_images: Array<{
        bag_tag_no: string;
        journey: string;
        origin: string;
        origin_date: string;
        destination: string;
        destination_date: string;
        name: string;
        type: string;
    }>,
) {
    return executeGraphQLRequest(endpoint, apiKey, MUTATION_SAVE_BAG_IMAGES, {
        bag_images,
    });
}

export function saveDamagedBagImages(
    endpoint: string,
    apiKey: string,
    bag_images: Array<{
        bag_tag_no: string;
        journey: string;
        origin: string;
        origin_date: string;
        destination: string;
        destination_date: string;
        name: string;
        type: string;
    }>,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_SAVE_DAMAGED_BAG_IMAGES,
        { bag_images },
    );
}

export function saveVehicle(
    endpoint: string,
    apiKey: string,
    vehicle_number: string,
    journey?: string,
) {
    return executeGraphQLRequest(endpoint, apiKey, MUTATION_SAVE_VEHICLE, {
        vehicle_number,
        journey,
    });
}

export function saveTrackingPointsForBagsOnVehicle(
    endpoint: string,
    apiKey: string,
    vehicle_number: string,
    journey: string,
    status: string,
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_SAVE_TRACKING_POINTS_FOR_BAGS_ON_VEHICLE,
        { vehicle_number, journey, status },
    );
}

export function updateTrackedBag(
    endpoint: string,
    apiKey: string,
    bag: {
        bag_tag_no: string;
        journey: string;
        status: string;
        location?: string;
        origin: string;
        origin_date: string;
        destination: string;
        destination_date: string;
        vehicle_number?: string;
        last_updated: string;
        damaged?: boolean;
        images?: Array<{ name: string; type: string }>;
        gha?: string;
        updated_by: string;
        additional_data?: string;
    },
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_UPDATE_TRACKED_BAG,
        { bag },
    );
}

export function reportDamageBag(
    endpoint: string,
    apiKey: string,
    params: {
        bag_tag_no: string;
        journey: string;
        damage_description: string;
        location: string;
        images?: Array<{ name: string; type: string }>;
        origin?: string;
        origin_date?: string;
        destination?: string;
        destination_date?: string;
    },
) {
    return executeGraphQLRequest(
        endpoint,
        apiKey,
        MUTATION_REPORT_DAMAGE_BAG,
        params,
    );
}
// Added getTenBags query (testing / sample data)

/* Wrapper */
export function getTenBags(endpoint: string, apiKey: string) {
    return executeGraphQLRequest(endpoint, apiKey, QUERY_TEN_BAGS);
}
