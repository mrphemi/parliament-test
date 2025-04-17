import "../style.scss";

type MemberApiResponse = {
  value: {
    nameDisplayAs: string;
    latestParty: { name: string };
    latestHouseMembership: {
      membershipFrom: string;
      membershipEndDate: string;
    };
    thumbnailUrl: string;
  };
};

type Member = {
  name: string;
  party: string;
  image: string;
  constituency: string;
  membershipEndDate: string | null;
};

/** Our main application class, extend this as needed. */
class Main {
  private readonly verificationLog: string = "Hello world!";
  private baseUrl = "https://members-api.parliament.uk/api";

  constructor() {
    // Verify the application is running as intended by viewing this log in your
    // browser's development console. Feel free to delete this log once confirmed.
    console.log(this.verificationLog);

    const searchParams = new URLSearchParams(window.location.search);
    const memberId = searchParams.get("member_id");
    this.getMember(memberId ? Number(memberId) : null);
  }

  /**
   * Fetches a member by their ID and displays their details
   * @param memberId The member ID to fetch
   */
  async getMember(memberId: number | null) {
    if (isNaN(Number(memberId)) || memberId === null) {
      throw new Error("Invalid member ID: Member Id must be a number");
    }

    try {
      const res = await fetch(`${this.baseUrl}/Members/${memberId}
  `);

      if (res.ok) {
        const data: MemberApiResponse = await res.json();
        this.displayMemberDetails({
          name: data.value.nameDisplayAs,
          party: data.value.latestParty.name,
          image: data.value.thumbnailUrl,
          constituency: data.value.latestHouseMembership.membershipFrom,
          membershipEndDate: data.value.latestHouseMembership.membershipEndDate,
        });
      } else {
        const errorText = await res.text();
        console.error(`Error: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Cannot fetch member data:", error);
    }
  }

  /**
   * Displays member details in the HTML
   * @param memberData The member data to display
   */
  displayMemberDetails({
    name,
    party,
    image,
    constituency,
    membershipEndDate,
  }: Member) {
    const member: HTMLElement = document.querySelector(".member-card");
    const memberName = document.querySelector(".member-card__name");
    const memberParty = document.querySelector(".member-card__party");
    const memberConstituency = document.querySelector(
      ".member-card__constituency"
    );
    const memberImage: HTMLImageElement = document.querySelector(
      ".member-card__image"
    );

    memberImage.src = image;
    memberName.textContent = name;
    memberParty.textContent = party;
    memberConstituency.textContent = constituency;

    if (membershipEndDate) {
      const now = new Date();
      const end = new Date(membershipEndDate);

      now.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (now > end) {
        member.dataset.status = "inactive";
      }
    } else {
      member.dataset.status = "active";
    }
  }
}

new Main();
