// types.ts
export interface Place {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  province: string;
  city: string;
  category: string;
  cover_image: string;
  location: {
    latitude: string;
    longitude: string;
  };
  has_stay: boolean;
  road_type: string;
  difficulty: string;
}

export interface ApiResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: Place[];
}

export interface PlaceDetails {
  id: number;
  title: string;
  slug: string;

  short_description: string;
  description: string;

  address: string;
  category: string;
  visit_time: string;

  contact: {
    phone: string | null;
    website: string | null;
  };

  location: {
    province: string;
    city: string;
    latitude: string;
    longitude: string;
    altitude: string;
  };

  features: {
    national_registered: boolean;
    suitable_children: boolean;
    suitable_elderly: boolean;
    wheelchair_access: boolean;
    has_stay: boolean;
  };

  road: {
    type: string;
    difficulty: string;
  };

  images: {
    image: string;
    is_cover: string;
  }[];

  facilities: {
    id: string;
    title: string;
    icon: string;
  }[];

  accommodations: {
    id: string;
    title: string;
  }[];

  seasons: {
    id: string;
    title: string;
  }[];

  visitors: {
    id: string;
    title: string;
  }[];

  rules: {
    id: string;
    title: string;
  }[];

  warnings: {
    id: string;
    title: string;
  }[];

  equipments: {
    id: string;
    title: string;
    icon: string;
  }[];
}
