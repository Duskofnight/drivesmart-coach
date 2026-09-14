import fourWayStop from "@/assets/scenario-four-way-stop.jpg";
import schoolZone from "@/assets/scenario-school-zone.jpg";
import leftTurn from "@/assets/scenario-left-turn.jpg";
import roundabout from "@/assets/scenario-roundabout.jpg";
import parallelPark from "@/assets/scenario-parallel-park.jpg";
import highwayMerge from "@/assets/scenario-highway-merge.jpg";
import hillPark from "@/assets/scenario-hill-park.jpg";
import winter from "@/assets/scenario-winter.jpg";
import construction from "@/assets/scenario-construction.jpg";
import railway from "@/assets/scenario-railway.jpg";
import emergency from "@/assets/scenario-emergency.jpg";
import parkingLot from "@/assets/scenario-parking-lot.jpg";
import laneChange from "@/assets/scenario-lane-change.jpg";
import rightTurnRed from "@/assets/scenario-right-turn-red.jpg";
import crosswalk from "@/assets/scenario-crosswalk.jpg";
import schoolBus from "@/assets/scenario-school-bus.jpg";
import uncontrolled from "@/assets/scenario-uncontrolled.jpg";
import threePoint from "@/assets/scenario-three-point.jpg";
import nightDrive from "@/assets/scenario-night.jpg";
import gravel from "@/assets/scenario-gravel.jpg";
import driveway from "@/assets/scenario-driveway.jpg";
import following from "@/assets/scenario-following.jpg";
import fourWayClip from "@/assets/clip-four-way-stop.mp4.asset.json";

export type Tier = "free" | "premium";

export type SceneStep = {
  /** Short instruction shown as the coach narration for this beat. */
  say: string;
  /** What the examiner is actually watching for. */
  watch: string;
  /** Focus marker position as a percentage of the frame. */
  focus: { x: number; y: number; label: string };
  /** How long this beat plays, in ms. */
  hold?: number;
};

export type Scenario = {
  slug: string;
  title: string;
  subtitle: string;
  topic: string;
  tier: Tier;
  minutes: number;
  image: string;
  clip?: string;
  rule: string;
  ruleSource: string;
  steps: SceneStep[];
  faults: string[];
  quiz: { question: string; options: string[]; answer: number; why: string };
};

export const scenarios: Scenario[] = [
  {
    slug: "four-way-stop",
    title: "The four-way stop",
    subtitle: "Who goes first, and what a real stop looks like",
    topic: "Intersections",
    tier: "free",
    minutes: 6,
    image: fourWayStop,
    clip: (fourWayClip as { url: string }).url,
    rule: "Come to a complete stop at the stop line — wheels fully stopped, not rolling. Whoever stops first goes first. If two vehicles stop at the same time, the one on the right has the right of way.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — right of way at stop signs",
    steps: [
      {
        say: "Start easing off the gas well before the sign. Braking late is the single most common fault here.",
        watch: "Smooth, progressive braking — no last-second stab at the pedal.",
        focus: { x: 82, y: 32, label: "Stop sign" },
      },
      {
        say: "Stop with your bumper behind the white line. Feel the car settle — that pause is what the examiner is looking for.",
        watch: "A full stop behind the line, not on top of it.",
        focus: { x: 52, y: 71, label: "Stop line" },
      },
      {
        say: "Now scan left, centre, right. The silver sedan is already crossing, so it owns the intersection.",
        watch: "Visible head movement. Eyes only is scored as no scan.",
        focus: { x: 56, y: 56, label: "Crossing traffic" },
      },
      {
        say: "Check the far corners for pedestrians before you creep. People step off curbs late.",
        watch: "A pedestrian check on both sides before moving.",
        focus: { x: 88, y: 62, label: "Corner + sidewalk" },
      },
      {
        say: "Clear? Move off steadily and straight through. No rolling starts, no hesitating in the middle.",
        watch: "Decisive, continuous movement through the box.",
        focus: { x: 50, y: 50, label: "Your path" },
      },
    ],
    faults: [
      "Rolling stop (wheels never fully stop)",
      "Stopping past the line or into the crosswalk",
      "Failing to yield to the vehicle on your right on a simultaneous stop",
      "Creeping out then stopping again in the intersection",
    ],
    quiz: {
      question: "You and another driver reach a four-way stop at exactly the same moment, facing each other at right angles. Who goes first?",
      options: [
        "Whoever is bigger or faster",
        "The driver on the right",
        "The driver on the left",
        "Whoever flashes their lights first",
      ],
      answer: 1,
      why: "On a simultaneous arrival the vehicle on the right has the right of way. Yield, make eye contact, then proceed.",
    },
  },
  {
    slug: "school-and-playground-zones",
    title: "School and playground zones",
    subtitle: "Speed, timing, and the kids you can't see yet",
    topic: "Speed control",
    tier: "free",
    minutes: 5,
    image: schoolZone,
    rule: "School and playground zones in Alberta are 30 km/h during the hours shown on the sign. Playground zones commonly run from 8:30 a.m. to one hour after sunset. Always read the tab under the sign — hours vary by municipality.",
    ruleSource: "Alberta Traffic Safety Act — school and playground zone speeds",
    steps: [
      {
        say: "Spot the fluorescent yellow-green sign early and read the tab underneath — that's the speed and the hours.",
        watch: "Speed reduced before the sign, not after it.",
        focus: { x: 16, y: 20, label: "30 km/h zone sign" },
      },
      {
        say: "Cover the brake and drop to 30. Coasting down beats braking hard at the sign.",
        watch: "At or under 30 km/h the moment you pass the sign.",
        focus: { x: 16, y: 27, label: "Speed tab" },
      },
      {
        say: "The group on the sidewalk is your live hazard. Kids change direction without warning.",
        watch: "Eyes moving between the sidewalk and the crosswalk ahead.",
        focus: { x: 28, y: 53, label: "Children on sidewalk" },
      },
      {
        say: "Approach the crosswalk ready to stop. Never pass another vehicle stopped at a crosswalk.",
        watch: "Yielding to anyone stepping in, and no passing at crosswalks.",
        focus: { x: 66, y: 65, label: "Crosswalk" },
      },
      {
        say: "Hold 30 until you're clearly past the end-of-zone sign. Accelerating early is a common ticket.",
        watch: "Speed held through the whole zone.",
        focus: { x: 84, y: 48, label: "End of zone" },
      },
    ],
    faults: [
      "Braking to 30 after entering the zone",
      "Accelerating before the zone ends",
      "Passing a vehicle stopped at a crosswalk",
      "Missing pedestrians waiting at the curb",
    ],
    quiz: {
      question: "What is the speed limit in an Alberta school zone during posted hours?",
      options: ["50 km/h", "40 km/h", "30 km/h", "It depends on traffic"],
      answer: 2,
      why: "30 km/h during the hours shown on the sign. The tab under the sign always tells you the hours.",
    },
  },
  {
    slug: "left-turn-at-lights",
    title: "Left turn at a green light",
    subtitle: "Positioning, wheels straight, and the pedestrian trap",
    topic: "Intersections",
    tier: "free",
    minutes: 7,
    image: leftTurn,
    rule: "On a solid green you may enter the intersection to turn left, but you must yield to oncoming traffic and to pedestrians in the crosswalk. Keep your wheels straight while waiting.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — turning left",
    steps: [
      {
        say: "Signal early and take the left portion of your lane. Position tells other drivers your plan.",
        watch: "Signal on well before the intersection.",
        focus: { x: 34, y: 74, label: "Lane position" },
      },
      {
        say: "Enter the intersection only far enough to see past oncoming traffic. Wheels dead straight.",
        watch: "Wheels straight — turned wheels push you into traffic if you're hit from behind.",
        focus: { x: 50, y: 66, label: "Front wheels" },
      },
      {
        say: "Oncoming vehicles own the road until there's a real gap. A gap you have to rush is not a gap.",
        watch: "Patience — the examiner would rather see you wait a cycle.",
        focus: { x: 46, y: 57, label: "Oncoming traffic" },
      },
      {
        say: "That group in the crosswalk owns your exit lane. Even a clear road ahead doesn't mean go.",
        watch: "Yielding to pedestrians in the crosswalk you're turning into.",
        focus: { x: 62, y: 62, label: "Pedestrians" },
      },
      {
        say: "Now turn into the closest legal lane, straighten up, and cancel the signal.",
        watch: "Ending in the correct lane with the signal cancelled.",
        focus: { x: 78, y: 68, label: "Exit lane" },
      },
    ],
    faults: [
      "Turning with wheels pre-turned while waiting",
      "Cutting the corner into the far lane",
      "Failing to yield to pedestrians on the exit side",
      "Leaving the signal on after the turn",
    ],
    quiz: {
      question: "You are waiting in the intersection to turn left on a green light. Where should your front wheels point?",
      options: [
        "Angled left, ready to go",
        "Straight ahead",
        "Angled right to see better",
        "It does not matter",
      ],
      answer: 1,
      why: "Wheels straight. If you are rear-ended with wheels turned, your car is pushed into oncoming traffic.",
    },
  },
  {
    slug: "roundabouts",
    title: "Roundabouts",
    subtitle: "Yield, pick your lane, signal out",
    topic: "Intersections",
    tier: "free",
    minutes: 5,
    image: roundabout,
    rule: "Yield to traffic already in the roundabout and enter only when there is a safe gap. Do not stop inside the circle. Signal right before your exit.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — roundabouts",
    steps: [
      {
        say: "Read the sign as you approach — it tells you which lane serves your exit.",
        watch: "Correct lane chosen before the yield line.",
        focus: { x: 90, y: 22, label: "Roundabout sign" },
      },
      {
        say: "Slow to a crawl and look left. Traffic in the circle has the right of way.",
        watch: "Yielding at the line without stopping dead when it is clear.",
        focus: { x: 10, y: 45, label: "Traffic from left" },
      },
      {
        say: "The blue crossover is already circulating, so let it pass before you commit.",
        watch: "Not forcing a gap.",
        focus: { x: 63, y: 48, label: "Circulating vehicle" },
      },
      {
        say: "Enter smoothly, stay in your lane, and keep moving around the island.",
        watch: "No lane changes inside the circle, no stopping.",
        focus: { x: 44, y: 50, label: "Your lane" },
      },
      {
        say: "Signal right as you pass the exit before yours, then leave, checking for pedestrians at the crossing.",
        watch: "Right signal on before the exit and a pedestrian check on the way out.",
        focus: { x: 80, y: 58, label: "Your exit" },
      },
    ],
    faults: [
      "Stopping inside the roundabout",
      "Entering without yielding to circulating traffic",
      "Changing lanes inside the circle",
      "No right signal before exiting",
    ],
    quiz: {
      question: "Who has the right of way at an Alberta roundabout?",
      options: [
        "Vehicles entering the roundabout",
        "Vehicles already in the roundabout",
        "The larger vehicle",
        "Whoever arrives fastest",
      ],
      answer: 1,
      why: "Traffic already circulating has the right of way. You yield on entry and never stop inside the circle.",
    },
  },
  {
    slug: "parallel-parking",
    title: "Parallel parking",
    subtitle: "Reference points that work every time",
    topic: "Parking",
    tier: "free",
    minutes: 9,
    image: parallelPark,
    rule: "Park within 50 cm of the curb, parallel to it, and leave room for the vehicles ahead and behind. Signal before stopping and shoulder check before every direction change.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — parallel parking",
    steps: [
      {
        say: "Signal right, then pull up beside the front car about a metre out, rear bumpers roughly level.",
        watch: "Signal on and a safe setup distance from the parked car.",
        focus: { x: 62, y: 40, label: "Reference car" },
      },
      {
        say: "Shoulder check, then reverse straight until your mirror lines up with that car's rear bumper.",
        watch: "A real shoulder check before the car moves backwards.",
        focus: { x: 72, y: 30, label: "Rear bumper line" },
      },
      {
        say: "Full lock toward the curb and reverse slowly until the car sits at about 45 degrees.",
        watch: "Slow, controlled reversing with eyes mostly out the back window.",
        focus: { x: 78, y: 56, label: "45° angle" },
      },
      {
        say: "When the curb appears in your left mirror, straighten the wheel and keep backing in.",
        watch: "Not clipping or riding up the curb.",
        focus: { x: 88, y: 64, label: "Curb in mirror" },
      },
      {
        say: "Counter-steer away from the curb to bring the nose in, then straighten and centre in the space.",
        watch: "Finished within 50 cm of the curb, parallel, evenly spaced.",
        focus: { x: 50, y: 62, label: "Final position" },
      },
    ],
    faults: [
      "Touching or mounting the curb",
      "Finishing more than 50 cm from the curb",
      "Reversing without a shoulder check",
      "More than the allowed number of correction moves",
    ],
    quiz: {
      question: "After parallel parking in Alberta, how far from the curb may your wheels be?",
      options: ["No more than 50 cm", "No more than 1 metre", "Any distance if you are straight", "Touching the curb is required"],
      answer: 0,
      why: "Within 50 cm of the curb, parallel to it. Touching the curb costs you marks too.",
    },
  },
  {
    slug: "highway-merge",
    title: "Merging onto the highway",
    subtitle: "Speed matching and the shoulder check that saves you",
    topic: "Highway driving",
    tier: "free",
    minutes: 8,
    image: highwayMerge,
    rule: "Use the acceleration lane to reach the speed of traffic, signal, shoulder check your blind spot, and merge into a gap. Merging traffic yields to traffic already on the highway.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — freeway driving",
    steps: [
      {
        say: "On the ramp, look ahead into the traffic stream and start picking your gap early.",
        watch: "Planning ahead instead of reacting at the end of the ramp.",
        focus: { x: 40, y: 46, label: "Traffic stream" },
      },
      {
        say: "Accelerate in the merge lane until you match traffic speed. Merging slow is dangerous, not careful.",
        watch: "Speed matched to traffic before merging.",
        focus: { x: 70, y: 60, label: "Acceleration lane" },
      },
      {
        say: "Signal left, mirror, then a physical shoulder check — the blind spot hides a whole vehicle.",
        watch: "Mirror plus over-the-shoulder check, in that order.",
        focus: { x: 22, y: 52, label: "Blind spot" },
      },
      {
        say: "Ease into the gap in one smooth movement. No swerving, no braking mid-merge.",
        watch: "One continuous, smooth lane entry.",
        focus: { x: 52, y: 55, label: "Your gap" },
      },
      {
        say: "Cancel the signal and open up a two to three second following distance behind that pickup.",
        watch: "Following distance re-established after the merge.",
        focus: { x: 24, y: 55, label: "Following distance" },
      },
    ],
    faults: [
      "Merging well below traffic speed",
      "No shoulder check before crossing the line",
      "Stopping at the end of the acceleration lane",
      "Forcing a gap and making another driver brake",
    ],
    quiz: {
      question: "You are merging onto a busy Alberta highway. What should your speed be as you enter the traffic lane?",
      options: [
        "As slow as possible for safety",
        "About the speed of the traffic you're joining",
        "Well above traffic speed",
        "Whatever the ramp sign says, held all the way in",
      ],
      answer: 1,
      why: "Match the speed of traffic using the acceleration lane. Merging much slower forces others to brake and is a serious fault.",
    },
  },
  {
    slug: "hill-parking",
    title: "Parking on a hill",
    subtitle: "Which way the wheels go, and why",
    topic: "Parking",
    tier: "premium",
    minutes: 4,
    image: hillPark,
    rule: "Facing downhill, turn your front wheels toward the curb. Facing uphill with a curb, turn them away from the curb. With no curb, always turn toward the shoulder. Set the parking brake every time.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — parking on hills",
    steps: [
      {
        say: "Pull in parallel to the curb and stop with your wheels close, within 50 cm.",
        watch: "Position and distance from the curb.",
        focus: { x: 62, y: 62, label: "Curb distance" },
      },
      {
        say: "This car faces downhill, so the front wheels turn toward the curb — gravity then wedges the tyre.",
        watch: "Wheels turned the correct way for the slope.",
        focus: { x: 55, y: 72, label: "Front wheels" },
      },
      {
        say: "Set the parking brake before you shift, then select park — or first gear if it's manual.",
        watch: "Parking brake set before shifting out of drive.",
        focus: { x: 74, y: 55, label: "Parked and secured" },
      },
      {
        say: "Roll back a few centimetres against the curb so you can feel the tyre make contact.",
        watch: "Vehicle secured and not able to roll.",
        focus: { x: 66, y: 74, label: "Tyre against curb" },
      },
      {
        say: "Before you open the door, mirror and shoulder check for cyclists coming down the hill.",
        watch: "Checking for traffic before opening the door.",
        focus: { x: 20, y: 60, label: "Traffic check" },
      },
    ],
    faults: [
      "Wheels turned the wrong way for the slope",
      "No parking brake",
      "Parked too far from the curb",
      "Opening the door into traffic without checking",
    ],
    quiz: {
      question: "You are parking facing downhill next to a curb. Which way do you turn your front wheels?",
      options: ["Toward the curb", "Away from the curb", "Straight ahead", "It only matters in winter"],
      answer: 0,
      why: "Downhill, wheels toward the curb. Uphill with a curb, wheels away from the curb. No curb, always toward the shoulder.",
    },
  },
  {
    slug: "winter-driving",
    title: "Winter driving in Alberta",
    subtitle: "Space, smoothness, and reading black ice",
    topic: "Conditions",
    tier: "free",
    minutes: 8,
    image: winter,
    rule: "You must drive at a speed that is safe for conditions, even if that is well below the posted limit. Clear all snow and ice off the vehicle before driving, and increase following distance on slippery roads.",
    ruleSource: "Alberta Traffic Safety Act — speed and conditions",
    steps: [
      {
        say: "Posted limit is a maximum for perfect conditions. On packed snow, that limit is not your speed.",
        watch: "Speed clearly adjusted to conditions.",
        focus: { x: 50, y: 48, label: "Road surface" },
      },
      {
        say: "Stretch your following distance to four seconds or more. Stopping distance can double or triple.",
        watch: "A large, deliberate gap to the vehicle ahead.",
        focus: { x: 68, y: 42, label: "Vehicle ahead" },
      },
      {
        say: "Every input gets gentler — steering, gas and brakes. Sudden anything breaks traction.",
        watch: "Smooth, progressive control inputs.",
        focus: { x: 40, y: 66, label: "Tyre tracks" },
      },
      {
        say: "Blowing snow across the road means visibility can vanish. Ease off before it does, not after.",
        watch: "Anticipating visibility loss.",
        focus: { x: 24, y: 34, label: "Blowing snow" },
      },
      {
        say: "Bridges, shaded stretches and intersections ice up first. Treat them as slippery until proven otherwise.",
        watch: "Extra caution at known ice-prone spots.",
        focus: { x: 84, y: 52, label: "Ice-prone stretch" },
      },
    ],
    faults: [
      "Driving the posted limit in poor conditions",
      "Following too closely on snow or ice",
      "Abrupt braking or steering",
      "Driving with snow left on the windows or roof",
    ],
    quiz: {
      question: "The posted limit is 100 km/h but the highway is covered in packed snow. What is the legal expectation?",
      options: [
        "Drive 100 km/h — it is the posted limit",
        "Drive at a speed that is safe for the conditions, even if much slower",
        "Drive exactly 80 km/h",
        "Use your hazard lights and keep the posted speed",
      ],
      answer: 1,
      why: "The posted limit is the maximum in ideal conditions. Driving too fast for conditions is an offence in Alberta, even under the limit.",
    },
  },
  {
    slug: "construction-zones",
    title: "Construction zones",
    subtitle: "Flag people, cones, and doubled fines",
    topic: "Conditions",
    tier: "premium",
    minutes: 5,
    image: construction,
    rule: "Obey the flag person and the posted construction speed. In Alberta, fines are doubled in construction zones when workers are present.",
    ruleSource: "Alberta Traffic Safety Act — construction zone penalties",
    steps: [
      {
        say: "Orange signs are your warning. Slow down at the first one, not at the cones.",
        watch: "Early speed reduction on the orange warning.",
        focus: { x: 84, y: 42, label: "Orange warning sign" },
      },
      {
        say: "The flag person's direction overrides signs and lights. Their stop paddle is a legal stop.",
        watch: "Obeying the flag person immediately and completely.",
        focus: { x: 60, y: 46, label: "Flag person" },
      },
      {
        say: "Cones narrow your lane. Centre yourself and give the worker as much space as you can.",
        watch: "Lane discipline through the taper — no cone clipping.",
        focus: { x: 40, y: 58, label: "Cone taper" },
      },
      {
        say: "Hold well back from the vehicle ahead. Traffic in zones stops without warning.",
        watch: "Increased following distance in the zone.",
        focus: { x: 22, y: 48, label: "Queue ahead" },
      },
      {
        say: "Stay at the reduced speed until the end-of-zone sign. Fines double here when workers are present.",
        watch: "Speed held through the entire zone.",
        focus: { x: 30, y: 34, label: "Work area" },
      },
    ],
    faults: [
      "Ignoring or second-guessing a flag person",
      "Speeding through the zone",
      "Following too closely in stop-and-go work traffic",
      "Passing inside a coned taper",
    ],
    quiz: {
      question: "What happens to traffic fines in an Alberta construction zone when workers are present?",
      options: ["They stay the same", "They are doubled", "They are tripled", "Only speeding fines change"],
      answer: 1,
      why: "Fines are doubled in construction zones when workers are present. Flag person directions are legally binding.",
    },
  },
  {
    slug: "railway-crossings",
    title: "Railway crossings",
    subtitle: "Stop distance, second trains, and never stopping on the tracks",
    topic: "Rural driving",
    tier: "premium",
    minutes: 5,
    image: railway,
    rule: "When signals are flashing, a gate is down, or a train is approaching, stop no closer than 5 metres from the nearest rail. Never start across unless there is room for your whole vehicle on the far side.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — railway crossings",
    steps: [
      {
        say: "Slow early. Crossbucks mean a crossing whether or not lights are fitted.",
        watch: "Reduced speed on approach and a look both ways down the track.",
        focus: { x: 78, y: 30, label: "Crossbuck" },
      },
      {
        say: "Lights are flashing, so you stop — at least 5 metres back from the nearest rail.",
        watch: "A full stop well behind the rail, not creeping up to it.",
        focus: { x: 78, y: 46, label: "Flashing signals" },
      },
      {
        say: "Look and listen down the line both ways. A second train can follow on the other track.",
        watch: "Checking both directions, not just the side the train came from.",
        focus: { x: 20, y: 66, label: "Track both ways" },
      },
      {
        say: "Never shift gears on the tracks and never stop on them. Cross in one continuous move.",
        watch: "Continuous, steady crossing.",
        focus: { x: 50, y: 68, label: "Tracks" },
      },
      {
        say: "Make sure there is room for your whole car on the far side before you start across.",
        watch: "Confirming clear space beyond the crossing first.",
        focus: { x: 52, y: 58, label: "Far side clearance" },
      },
    ],
    faults: [
      "Stopping closer than 5 m to the rail",
      "Proceeding while lights still flash",
      "Stopping or shifting gears on the tracks",
      "Not checking for a second train",
    ],
    quiz: {
      question: "The crossing lights are flashing. How far back from the nearest rail must you stop in Alberta?",
      options: ["1 metre", "3 metres", "5 metres", "10 metres"],
      answer: 2,
      why: "No closer than 5 metres from the nearest rail, and you wait until the signals stop and the way is clear.",
    },
  },
  {
    slug: "emergency-vehicles",
    title: "Emergency vehicles",
    subtitle: "Pulling over, and the slow-down-and-move-over rule",
    topic: "Right of way",
    tier: "premium",
    minutes: 5,
    image: emergency,
    rule: "When an emergency vehicle approaches with lights or siren, pull to the right and stop until it passes. Passing a stopped emergency, tow or maintenance vehicle with lights flashing, slow to 60 km/h or the posted limit if lower, and move over if you safely can.",
    ruleSource: "Alberta Traffic Safety Act — emergency vehicles and slow down move over",
    steps: [
      {
        say: "Check your mirrors early — you often hear a siren long before you see it.",
        watch: "Regular mirror checks that catch it early.",
        focus: { x: 50, y: 45, label: "Rear-view mirror" },
      },
      {
        say: "Signal right and move to the right edge of the road. Don't brake hard in the lane.",
        watch: "Controlled move to the right, signalled.",
        focus: { x: 78, y: 55, label: "Right shoulder" },
      },
      {
        say: "Stop and wait. Don't stop in an intersection — clear it first, then pull over.",
        watch: "Stopping clear of intersections and driveways.",
        focus: { x: 60, y: 60, label: "Stopping spot" },
      },
      {
        say: "Let it fully pass, then check for a second unit before rejoining. They often travel in pairs.",
        watch: "Waiting for all units before moving.",
        focus: { x: 55, y: 50, label: "Ambulance" },
      },
      {
        say: "Passing a stopped emergency vehicle with lights on? Drop to 60 or lower and move over if you can.",
        watch: "Slow down and move over compliance.",
        focus: { x: 86, y: 56, label: "Passing lane" },
      },
    ],
    faults: [
      "Stopping in the middle of an intersection",
      "Failing to yield until the vehicle is very close",
      "Rejoining traffic before a second unit passes",
      "Passing a stopped emergency vehicle at full speed",
    ],
    quiz: {
      question: "You pass a police car stopped on the shoulder with its lights flashing on a 110 km/h highway. What must you do?",
      options: [
        "Maintain 110 km/h",
        "Slow to 60 km/h and move over if it is safe",
        "Stop completely",
        "Slow to 90 km/h",
      ],
      answer: 1,
      why: "Alberta's slow down move over rule: reduce to 60 km/h (or the posted limit if lower) and move over a lane where you safely can.",
    },
  },
  {
    slug: "parking-lots",
    title: "Parking lots and reversing",
    subtitle: "The low-speed situation that fails the most tests",
    topic: "Parking",
    tier: "premium",
    minutes: 6,
    image: parkingLot,
    rule: "Lots are shared space with pedestrians. Drive at a walking-pace speed, follow the painted arrows and lanes, and reverse only with full 360-degree observation.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — reversing and low-speed control",
    steps: [
      {
        say: "Follow the painted arrows and treat every aisle as a two-way street with pedestrians.",
        watch: "Correct direction of travel and a slow, steady speed.",
        focus: { x: 64, y: 62, label: "Directional arrow" },
      },
      {
        say: "Scan between parked cars for people and reverse lights coming on.",
        watch: "Active scanning between vehicles, not just straight ahead.",
        focus: { x: 20, y: 50, label: "Between parked cars" },
      },
      {
        say: "The shopper with the cart has priority. Cover the brake and be ready to stop.",
        watch: "Yielding to pedestrians anywhere in the lot.",
        focus: { x: 6, y: 55, label: "Pedestrian with cart" },
      },
      {
        say: "Backing into a stall is safer: you leave facing out. Full 360 check, then reverse slowly.",
        watch: "A complete 360-degree check before reversing.",
        focus: { x: 84, y: 50, label: "Target stall" },
      },
      {
        say: "Finish inside the lines, wheels straight, then park brake before you shift out.",
        watch: "Centred in the stall with the parking brake set.",
        focus: { x: 78, y: 58, label: "Stall lines" },
      },
    ],
    faults: [
      "Reversing without a full 360 check",
      "Cutting across empty stalls diagonally",
      "Rolling too fast down an aisle",
      "Finishing across the stall line",
    ],
    quiz: {
      question: "Before reversing out of a parking stall, what observation is required?",
      options: [
        "A glance in the rear-view mirror",
        "The backup camera only",
        "A full 360-degree check including over both shoulders",
        "Nothing, if the lot looks empty",
      ],
      answer: 2,
      why: "A full 360-degree check. Cameras and mirrors have blind spots exactly where small children and cyclists are.",
    },
  },
  {
    slug: "lane-changes",
    title: "Lane changes and blind spots",
    subtitle: "Mirror, signal, shoulder check — in that order",
    topic: "City driving",
    tier: "free",
    minutes: 6,
    image: laneChange,
    rule: "Signal your intention, check mirrors and your blind spot, and change lanes only when there is a safe gap. You must not change lanes across a solid line or inside an intersection.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — changing lanes",
    steps: [
      {
        say: "Decide early. A lane change planned three blocks out is smooth; one planned three metres out is a fault.",
        watch: "Planning ahead instead of reacting to your turn.",
        focus: { x: 50, y: 44, label: "Road ahead" },
      },
      {
        say: "Mirror first — centre, then the side mirror on the side you're moving to.",
        watch: "Mirror use before the signal, not after.",
        focus: { x: 22, y: 48, label: "Side mirror" },
      },
      {
        say: "Signal for at least three flashes so drivers around you can react.",
        watch: "Signal on early and left on through the move.",
        focus: { x: 62, y: 88, label: "Signal stalk" },
      },
      {
        say: "Now the shoulder check. That silver SUV sits exactly where mirrors hide a car.",
        watch: "A real head turn — mirrors alone is scored as no blind-spot check.",
        focus: { x: 18, y: 55, label: "Blind spot" },
      },
      {
        say: "Move over in one smooth line, keep your speed, cancel the signal, then rebuild your gap.",
        watch: "One steady movement, speed unchanged, signal cancelled.",
        focus: { x: 46, y: 62, label: "New lane" },
      },
    ],
    faults: [
      "No shoulder check before crossing the line",
      "Signalling after starting to move",
      "Drifting across two lanes in one move",
      "Slowing down in the middle of the change",
    ],
    quiz: {
      question: "What is the correct order for a lane change?",
      options: [
        "Signal, move, then check",
        "Mirror, signal, shoulder check, move",
        "Shoulder check, move, signal",
        "Mirror, move, signal",
      ],
      answer: 1,
      why: "Mirror, signal, blind-spot shoulder check, then move. Skipping the shoulder check is one of the most common road-test faults.",
    },
  },
  {
    slug: "right-turn-on-red",
    title: "Right turn on a red light",
    subtitle: "Legal in Alberta — but only after a full stop",
    topic: "Intersections",
    tier: "free",
    minutes: 5,
    image: rightTurnRed,
    rule: "In Alberta you may turn right on a red light after coming to a complete stop, unless a sign prohibits it. You must yield to pedestrians and to all traffic.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — turning on a red light",
    steps: [
      {
        say: "Come to a complete stop behind the line first. The turn is only legal after a real stop.",
        watch: "Full stop before the crosswalk, wheels stopped.",
        focus: { x: 50, y: 76, label: "Stop line" },
      },
      {
        say: "Look for a 'no right turn on red' sign. If it's there, you wait for green — no exceptions.",
        watch: "Reading the signal head and any posted restriction.",
        focus: { x: 66, y: 20, label: "Signal + signs" },
      },
      {
        say: "Pedestrians in your crosswalk own it. Two are stepping off the curb now, so you stay put.",
        watch: "Yielding to pedestrians before easing forward.",
        focus: { x: 26, y: 62, label: "Pedestrians" },
      },
      {
        say: "Check left for cross traffic, then right for cyclists riding up beside you.",
        watch: "A left-then-right scan, including the bike lane.",
        focus: { x: 84, y: 55, label: "Cross traffic + bikes" },
      },
      {
        say: "Clear? Turn into the nearest right lane, straighten, cancel the signal.",
        watch: "Finishing in the closest legal lane.",
        focus: { x: 74, y: 66, label: "Nearest lane" },
      },
    ],
    faults: [
      "Rolling through the red without stopping",
      "Turning where a sign prohibits it",
      "Cutting off a pedestrian or cyclist",
      "Turning wide into the far lane",
    ],
    quiz: {
      question: "In Alberta, when can you turn right on a red light?",
      options: [
        "Never",
        "After a complete stop, if no sign prohibits it and the way is clear",
        "Only between 9 a.m. and 5 p.m.",
        "Any time, without stopping, if the road looks clear",
      ],
      answer: 1,
      why: "It is legal after a complete stop unless a sign says otherwise, and only once pedestrians and traffic are clear.",
    },
  },
  {
    slug: "crosswalks",
    title: "Marked crosswalks",
    subtitle: "Stopping distance, and why you never pass a stopped car",
    topic: "Pedestrians",
    tier: "free",
    minutes: 5,
    image: crosswalk,
    rule: "You must yield to pedestrians in a crosswalk and stop far enough back that drivers behind you can see them. Never pass a vehicle stopped at a crosswalk.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — pedestrian crossings",
    steps: [
      {
        say: "Scan the sidewalks on both sides as you approach. People at the curb are about to become people on the road.",
        watch: "Eyes moving to both curbs, speed already easing.",
        focus: { x: 20, y: 50, label: "Curb both sides" },
      },
      {
        say: "Someone with a stroller has stepped in. Stop well back — not right at their feet.",
        watch: "A stop with a clear buffer before the crossing.",
        focus: { x: 50, y: 62, label: "Pedestrian in crosswalk" },
      },
      {
        say: "Wait until they're fully across and on the far curb, not just past your lane.",
        watch: "Waiting for a complete crossing.",
        focus: { x: 72, y: 60, label: "Far curb" },
      },
      {
        say: "Never pass a vehicle stopped at a crosswalk — it is hiding someone from you.",
        watch: "No overtaking near a crossing.",
        focus: { x: 12, y: 52, label: "Stopped vehicle" },
      },
      {
        say: "Move off gently and re-check the crossing before you clear it.",
        watch: "A final look before accelerating away.",
        focus: { x: 50, y: 70, label: "Crossing clear" },
      },
    ],
    faults: [
      "Stopping on the crosswalk lines",
      "Moving off while a pedestrian is still crossing",
      "Passing a stopped vehicle at a crossing",
      "Waving pedestrians across into another lane's traffic",
    ],
    quiz: {
      question: "A car in the lane beside you is stopped at a marked crosswalk. What do you do?",
      options: [
        "Pass carefully",
        "Stop as well — it may be yielding to someone you cannot see",
        "Sound your horn",
        "Change lanes and continue",
      ],
      answer: 1,
      why: "Never pass a vehicle stopped at a crosswalk. It is almost always hiding a pedestrian from your view.",
    },
  },
  {
    slug: "school-bus",
    title: "Stopped school buses",
    subtitle: "Red lights flashing means stop — both directions",
    topic: "Pedestrians",
    tier: "free",
    minutes: 4,
    image: schoolBus,
    rule: "When a school bus has its upper red lights flashing, you must stop at least 20 metres away, from both directions, unless you are on the far side of a divided highway with a median.",
    ruleSource: "Alberta Traffic Safety Act — school bus stopping requirements",
    steps: [
      {
        say: "Amber lights mean it's about to stop. Start slowing then — don't try to beat it.",
        watch: "Early reaction to the amber warning lights.",
        focus: { x: 50, y: 24, label: "Amber lights" },
      },
      {
        say: "Red lights and the stop arm are out. Stop at least 20 metres back — about five car lengths.",
        watch: "A stop well back, not right at the bumper.",
        focus: { x: 52, y: 34, label: "Red lights + stop arm" },
      },
      {
        say: "Oncoming traffic stops too, unless there's a median dividing the highway.",
        watch: "Knowing both directions must stop on an undivided road.",
        focus: { x: 84, y: 52, label: "Oncoming lane" },
      },
      {
        say: "Watch for children crossing in front of the bus — they appear from nowhere and don't look.",
        watch: "Active watch for children on both sides of the bus.",
        focus: { x: 26, y: 62, label: "Children crossing" },
      },
      {
        say: "Wait for the lights to stop flashing and the arm to fold in before you move.",
        watch: "Staying stopped until the signals are fully off.",
        focus: { x: 50, y: 44, label: "Signals off" },
      },
    ],
    faults: [
      "Passing a bus with red lights flashing",
      "Stopping closer than 20 metres",
      "Moving before the stop arm folds in",
      "Not watching for children crossing ahead of the bus",
    ],
    quiz: {
      question: "A school bus ahead has its upper red lights flashing on an undivided road. What must you do?",
      options: [
        "Slow to 30 km/h and pass",
        "Stop at least 20 metres away and wait",
        "Stop only if you are behind the bus",
        "Pass on the left if the lane is clear",
      ],
      answer: 1,
      why: "Both directions stop at least 20 metres back until the red lights stop flashing and the stop arm is in.",
    },
  },
  {
    slug: "uncontrolled-intersections",
    title: "Uncontrolled intersections",
    subtitle: "No signs, no lights, all judgement",
    topic: "Intersections",
    tier: "free",
    minutes: 5,
    image: uncontrolled,
    rule: "At an intersection with no signs or signals, yield to any vehicle that arrives before you, and to the vehicle on your right when you arrive together. Approach at a speed that lets you stop.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — right of way",
    steps: [
      {
        say: "Residential intersections with no signs are common in Alberta. Treat every one as a yield.",
        watch: "Speed reduced on approach, foot covering the brake.",
        focus: { x: 50, y: 52, label: "Intersection ahead" },
      },
      {
        say: "Look through the corner gaps — parked cars and hedges hide approaching vehicles.",
        watch: "Looking early, before the corner blocks your view.",
        focus: { x: 22, y: 50, label: "Blocked sightline" },
      },
      {
        say: "That car on your right arrives with you, so it goes first. Right hand rule.",
        watch: "Yielding to the vehicle on your right.",
        focus: { x: 78, y: 58, label: "Vehicle on right" },
      },
      {
        say: "Never assume the other driver knows the rule. Wait for them to actually commit.",
        watch: "Confirming the other driver's movement before you go.",
        focus: { x: 64, y: 60, label: "Other driver" },
      },
      {
        say: "Then cross steadily, still scanning both ways as you go through.",
        watch: "Continuous scanning while crossing.",
        focus: { x: 50, y: 64, label: "Your path" },
      },
    ],
    faults: [
      "Entering at unchanged speed",
      "Failing to yield to the vehicle on the right",
      "No scan left and right before crossing",
      "Assuming the other driver will yield",
    ],
    quiz: {
      question: "Two cars reach an uncontrolled intersection at the same time. Who has the right of way?",
      options: [
        "The car on the left",
        "The car on the right",
        "The faster car",
        "The car going straight, always",
      ],
      answer: 1,
      why: "The vehicle on the right goes first. Approach slowly enough to stop, and never assume the other driver knows the rule.",
    },
  },
  {
    slug: "three-point-turn",
    title: "The three-point turn",
    subtitle: "Turning around in a narrow street without panic",
    topic: "Manoeuvres",
    tier: "free",
    minutes: 6,
    image: threePoint,
    rule: "A three-point turn is only legal where you have clear sightlines both ways and no sign prohibits it. Signal, check traffic and pedestrians before every direction change.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — turning around",
    steps: [
      {
        say: "Pick your spot: no hills, no curves, no driveways, and clear views both directions.",
        watch: "Choosing a legal, safe location before starting.",
        focus: { x: 50, y: 44, label: "Sightlines" },
      },
      {
        say: "Signal right, pull to the right edge, then check both ways and behind you.",
        watch: "Signal and a full traffic check before moving.",
        focus: { x: 76, y: 52, label: "Right edge" },
      },
      {
        say: "Signal left, then turn hard left and cross slowly to the far curb — slow hands off the gas.",
        watch: "Low speed with full steering lock.",
        focus: { x: 26, y: 56, label: "Far curb" },
      },
      {
        say: "Stop short of the curb, shift to reverse, full right lock, and back up while looking over your shoulder.",
        watch: "Looking back over the shoulder while reversing, not at the mirror only.",
        focus: { x: 62, y: 64, label: "Reverse arc" },
      },
      {
        say: "When you have room, shift to drive, straighten out, and pull away in your new lane.",
        watch: "Finishing in the correct lane without touching a curb.",
        focus: { x: 50, y: 60, label: "New direction" },
      },
    ],
    faults: [
      "Attempting it on a hill, curve or busy street",
      "Touching the curb",
      "No traffic check before each direction change",
      "Reversing while looking only in the mirror",
    ],
    quiz: {
      question: "Where is a three-point turn appropriate?",
      options: [
        "On any street when traffic is light",
        "On a quiet, level street with clear views in both directions",
        "Just past the crest of a hill",
        "On a curve, since traffic slows there",
      ],
      answer: 1,
      why: "You need clear sightlines both ways, level ground and no prohibiting sign. Hills and curves hide approaching traffic.",
    },
  },
  {
    slug: "following-distance",
    title: "Following distance in traffic",
    subtitle: "The two-second rule and rush-hour discipline",
    topic: "City driving",
    tier: "free",
    minutes: 5,
    image: following,
    rule: "Keep at least a two-second gap to the vehicle ahead in good conditions, and more in rain, snow or when following large vehicles.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — following distance",
    steps: [
      {
        say: "Pick a fixed point the car ahead passes, then count. Under two seconds and you're too close.",
        watch: "A gap the examiner can visibly see.",
        focus: { x: 50, y: 52, label: "Vehicle ahead" },
      },
      {
        say: "In stop-and-go traffic, leave enough room to see the rear tyres of the car ahead touch the road.",
        watch: "Gap kept even at crawling speed.",
        focus: { x: 46, y: 66, label: "Gap" },
      },
      {
        say: "Behind a truck or bus, double it. You can't see past them, so you need time instead.",
        watch: "Extra space behind large vehicles.",
        focus: { x: 62, y: 44, label: "Large vehicle" },
      },
      {
        say: "If someone tailgates you, don't brake at them — open more space in front instead.",
        watch: "Managing a tailgater by making space, not punishing them.",
        focus: { x: 26, y: 40, label: "Behind you" },
      },
      {
        say: "Look 12 to 15 seconds ahead — over the roofs, not at the bumper in front.",
        watch: "Eyes lifted well down the road.",
        focus: { x: 50, y: 36, label: "Far ahead" },
      },
    ],
    faults: [
      "Following closer than two seconds",
      "Staring at the bumper ahead instead of far down the road",
      "Braking hard because you saw the problem late",
      "Closing the gap when someone merges in",
    ],
    quiz: {
      question: "What is the minimum following distance in good conditions?",
      options: ["One car length", "Two seconds", "Half a second", "Ten metres at any speed"],
      answer: 1,
      why: "Two seconds in good conditions, measured in time not car lengths, and more in poor weather or behind big vehicles.",
    },
  },
  {
    slug: "night-driving",
    title: "Driving at night",
    subtitle: "Headlights, glare, and overdriving your lights",
    topic: "Conditions",
    tier: "premium",
    minutes: 6,
    image: nightDrive,
    rule: "Headlights must be on from half an hour after sunset to half an hour before sunrise, and whenever visibility is poor. Dim high beams within 300 metres of an oncoming vehicle and 150 metres when following.",
    ruleSource: "Alberta Traffic Safety Act — lighting requirements",
    steps: [
      {
        say: "Low beams on, dash lights dimmed, windshield clean inside and out. Glare starts on your own glass.",
        watch: "Correct lights on before you move.",
        focus: { x: 50, y: 86, label: "Headlights on" },
      },
      {
        say: "Slow down. If you can't stop within the distance your lights show, you're driving too fast.",
        watch: "Speed matched to how far you can actually see.",
        focus: { x: 50, y: 56, label: "Lit distance" },
      },
      {
        say: "Oncoming headlights: look to the right edge of your lane, not into the glare.",
        watch: "Eyes off the oncoming lights.",
        focus: { x: 22, y: 50, label: "Right edge line" },
      },
      {
        say: "Wet asphalt swallows lane markings. Use the curb and the car ahead's lights as reference.",
        watch: "Lane position held on poorly marked wet roads.",
        focus: { x: 66, y: 66, label: "Wet lane markings" },
      },
      {
        say: "Pedestrians in dark clothing appear late. Scan the shoulders and crossings deliberately.",
        watch: "Deliberate scanning of shoulders and crossings.",
        focus: { x: 84, y: 58, label: "Shoulder + crossing" },
      },
    ],
    faults: [
      "Driving faster than your lights let you stop",
      "High beams left on into oncoming traffic",
      "Staring into oncoming headlights",
      "Missing pedestrians at unlit crossings",
    ],
    quiz: {
      question: "How close to an oncoming vehicle must you dim your high beams in Alberta?",
      options: ["50 metres", "150 metres", "300 metres", "Only if they flash you"],
      answer: 2,
      why: "Within 300 metres of an oncoming vehicle, and within 150 metres when following another vehicle.",
    },
  },
  {
    slug: "gravel-roads",
    title: "Gravel and rural roads",
    subtitle: "Loose surfaces, dust clouds and hidden approaches",
    topic: "Rural driving",
    tier: "premium",
    minutes: 6,
    image: gravel,
    rule: "Reduce speed on gravel: traction and stopping distance are much worse than on pavement. Slow right down in dust and be ready for uncontrolled rural intersections.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — rural and gravel roads",
    steps: [
      {
        say: "Gravel steals grip. Drop well below the posted limit before you meet a corner, not in it.",
        watch: "Speed reduced for the surface.",
        focus: { x: 50, y: 66, label: "Loose surface" },
      },
      {
        say: "Steer and brake gently. Sharp inputs on gravel start slides you can't feel coming.",
        watch: "Smooth, minimal steering and braking.",
        focus: { x: 40, y: 74, label: "Wheel tracks" },
      },
      {
        say: "That oncoming truck's dust cloud will blind you. Slow down and move right before it reaches you.",
        watch: "Slowing for the dust instead of driving into it.",
        focus: { x: 52, y: 46, label: "Dust cloud" },
      },
      {
        say: "Rural crossroads often have no signs and crops block the view. Treat each as a yield.",
        watch: "Slowing for every rural intersection.",
        focus: { x: 80, y: 50, label: "Hidden approach" },
      },
      {
        say: "Watch for deer, farm equipment and soft shoulders — the edge can grab a wheel.",
        watch: "Hazard awareness and staying off the soft edge.",
        focus: { x: 16, y: 62, label: "Soft shoulder" },
      },
    ],
    faults: [
      "Driving the posted limit on loose gravel",
      "Driving straight into a dust cloud",
      "Not slowing for uncontrolled rural crossroads",
      "Dropping a wheel onto the soft shoulder",
    ],
    quiz: {
      question: "An oncoming truck on a gravel road is throwing up a thick dust cloud. What do you do?",
      options: [
        "Speed up to get through it faster",
        "Slow down, keep right, and be ready to stop",
        "Turn on high beams and hold your speed",
        "Move to the centre of the road",
      ],
      answer: 1,
      why: "Dust can blind you completely. Slow down, keep right, use low beams, and be prepared to stop.",
    },
  },
  {
    slug: "driveway-backing",
    title: "Backing out of a driveway",
    subtitle: "The everyday manoeuvre that hits the most people",
    topic: "Manoeuvres",
    tier: "premium",
    minutes: 4,
    image: driveway,
    rule: "You must yield to all traffic and pedestrians when backing out of a driveway onto a roadway. Reverse only when the whole path is clear.",
    ruleSource: "Alberta Basic Licence Driver's Handbook — reversing onto a roadway",
    steps: [
      {
        say: "Walk the path or check behind before you get in. Kids and toys live behind bumpers.",
        watch: "Confirming the area behind is clear before starting.",
        focus: { x: 60, y: 70, label: "Behind the car" },
      },
      {
        say: "Reverse at walking pace with your head turned, using mirrors and camera as extras only.",
        watch: "Head turned over the shoulder, very low speed.",
        focus: { x: 40, y: 46, label: "Over your shoulder" },
      },
      {
        say: "Stop at the sidewalk line. Cyclists and pedestrians on the walk have priority.",
        watch: "A pause at the sidewalk before crossing it.",
        focus: { x: 72, y: 52, label: "Sidewalk" },
      },
      {
        say: "Edge out only far enough to see past the parked cars, then re-check both directions.",
        watch: "Creeping and re-checking instead of one long reverse.",
        focus: { x: 20, y: 55, label: "Parked cars" },
      },
      {
        say: "Back into the nearest lane, straighten, then pull away in the correct direction.",
        watch: "Finishing in the right lane facing the right way.",
        focus: { x: 50, y: 62, label: "Nearest lane" },
      },
    ],
    faults: [
      "Reversing without checking behind first",
      "Crossing the sidewalk without stopping",
      "Reversing right across into the far lane",
      "Relying on the backup camera only",
    ],
    quiz: {
      question: "You are backing out of a driveway onto a residential street. Who has the right of way?",
      options: [
        "You do, because you were there first",
        "All road and sidewalk users — you must yield to everyone",
        "Only pedestrians",
        "Whoever is closest",
      ],
      answer: 1,
      why: "A vehicle entering a roadway from a driveway yields to all traffic and to pedestrians and cyclists on the sidewalk.",
    },
  },
];

export const scenarioBySlug = (slug: string) => scenarios.find((s) => s.slug === slug);
export const freeScenarios = scenarios.filter((s) => s.tier === "free");
