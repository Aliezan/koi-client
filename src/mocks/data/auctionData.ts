import { Auction, AuctionStatus } from "@/types/auctionTypes";

export const mockAuctions: Auction[] = [
  {
    auction_id: "1",
    title: "Premium Kohaku Koi",
    description: "Beautiful red and white Kohaku koi fish",
    rich_description:
      "<p>This premium Kohaku features vibrant red patterns on a pure white base. Excellent body conformation and skin quality.</p>",
    item: "kohaku_koi_001",
    start_datetime: "2024-01-01T10:00:00Z",
    end_datetime: "2024-01-08T10:00:00Z",
    status: AuctionStatus.DRAFT,
    current_highest_bid: "0",
    buynow_price: "1000.00",
    participation_fee: "25.00",
    bid_increment: "50.00",
    created_at: "2023-12-31T08:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
    deleted_at: null,
    highest_bid_id: "",
    winner_id: null,
    final_price: null,
    user: {
      user_id: "user1",
      username: "koi_master",
    },
    bids: [],
    participants: [],
    highest_bid: null,
    winner: null,
    participants_count: 0,
  },
  {
    auction_id: "2",
    title: "Young Showa Koi",
    description: "Promising young Showa with great pattern",
    rich_description:
      "<p>This young Showa shows excellent pattern development with clear black, red, and white coloration. Good potential for growth.</p>",
    item: "showa_koi_001",
    start_datetime: "2024-01-15T10:00:00Z",
    end_datetime: "2024-01-22T10:00:00Z",
    status: AuctionStatus.PENDING,
    current_highest_bid: "0",
    buynow_price: "800.00",
    participation_fee: "20.00",
    bid_increment: "40.00",
    created_at: "2024-01-01T09:00:00Z",
    updated_at: "2024-01-01T09:00:00Z",
    deleted_at: null,
    highest_bid_id: "",
    winner_id: null,
    final_price: null,
    user: {
      user_id: "user2",
      username: "koi_breeder",
    },
    bids: [],
    participants: [],
    highest_bid: null,
    winner: null,
    participants_count: 0,
  },
  {
    auction_id: "3",
    title: "Champion Sanke Koi",
    description: "Award-winning Sanke with exceptional quality",
    rich_description:
      "<p>This champion Sanke has won multiple awards for its perfect balance of red and black on white. Premium bloodline with excellent pedigree.</p>",
    item: "sanke_koi_001",
    start_datetime: "2023-12-20T10:00:00Z",
    end_datetime: "2023-12-27T10:00:00Z",
    status: AuctionStatus.COMPLETED,
    current_highest_bid: "2500.00",
    buynow_price: "2000.00",
    participation_fee: "50.00",
    bid_increment: "100.00",
    created_at: "2023-12-19T10:00:00Z",
    updated_at: "2023-12-27T10:00:00Z",
    deleted_at: null,
    highest_bid_id: "bid123",
    winner_id: "user4",
    final_price: "2500.00",
    user: {
      user_id: "user3",
      username: "koi_champion",
    },
    bids: [],
    participants: [],
    highest_bid: {
      bid_id: "bid123",
      bid_amount: "2500.00",
      bid_time: "2023-12-26T18:45:00Z",
      user: {
        user_id: "user4",
        username: "premium_collector",
      },
    },
    winner: {
      user_id: "user4",
      username: "premium_collector",
    },
    participants_count: 3,
  },
  {
    auction_id: "4",
    title: "Rare Tancho Koi",
    description: "Unique Tancho with perfect red spot",
    rich_description:
      "<p>This Tancho Koi features a perfectly round red spot on its head. Excellent body shape and fin quality.</p>",
    item: "tancho_koi_001",
    start_datetime: "2024-02-01T10:00:00Z",
    end_datetime: "2024-02-08T10:00:00Z",
    status: AuctionStatus.PUBLISHED,
    current_highest_bid: "0",
    buynow_price: "1500.00",
    participation_fee: "30.00",
    bid_increment: "75.00",
    created_at: "2024-01-02T10:00:00Z",
    updated_at: "2024-01-02T11:00:00Z",
    deleted_at: null,
    highest_bid_id: "",
    winner_id: null,
    final_price: null,
    user: {
      user_id: "user5",
      username: "koi_collector",
    },
    bids: [],
    participants: [],
    highest_bid: null,
    winner: null,
    participants_count: 0,
  },
  {
    auction_id: "5",
    title: "Butterfly Koi Pair",
    description: "Beautiful pair of long-finned butterfly koi",
    rich_description:
      "<p>This stunning pair of butterfly koi have exceptionally long, flowing fins and vibrant coloration. Perfect for ornamental ponds.</p>",
    item: "butterfly_koi_001",
    start_datetime: "2024-01-05T10:00:00Z",
    end_datetime: "2024-01-12T10:00:00Z",
    status: AuctionStatus.STARTED,
    current_highest_bid: "1300.00",
    buynow_price: "1200.00",
    participation_fee: "35.00",
    bid_increment: "60.00",
    created_at: "2024-01-04T10:00:00Z",
    updated_at: "2024-01-05T10:00:00Z",
    deleted_at: null,
    highest_bid_id: "bid456",
    winner_id: null,
    final_price: null,
    user: {
      user_id: "user6",
      username: "koi_enthusiast",
    },
    bids: [
      {
        bid_id: "bid456",
        bid_amount: "1300.00",
        bid_time: "2024-01-07T11:20:00Z",
        user: {
          user_id: "user15",
          username: "exotic_fish",
        },
      },
    ],
    participants: [],
    highest_bid: {
      bid_id: "bid456",
      bid_amount: "1300.00",
      bid_time: "2024-01-07T11:20:00Z",
      user: {
        user_id: "user15",
        username: "exotic_fish",
      },
    },
    winner: null,
    participants_count: 2,
  },
];
