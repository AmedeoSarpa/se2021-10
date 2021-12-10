# RETROSPECTIVE (Team #P10)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done
   / 5
- Total points committed vs done
  23 / 23
- Nr of hours planned vs spent (as a team)
  56h 30m / 58 20m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 13      | -      | 4d 7h      | 4d 7h 15m    |
| _#1_  | 3       | 5      | 4h         | 5h 15m       |
| _#2_  | 5       | 8      | 7h30m      | 6h45m        |
| _#3_  | 2       | 2      | 5h30m      | 4h50m        |
| _#4_  | 1       | 5      | 1h         | 30m          |
| _#5_  | 1       | 3      | 1h         | 30m          |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation) : 2h 25 m
- Total task estimation error ratio: 56h 30m / 58h 20m = 0.97

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated | 1h
  - Total hours spent | 1h
  - Nr of automated unit test cases 18
  - Coverage (if available)
- E2E testing:
  - Total hours estimated | 1h
  - Total hours spent | 1h
- Code review
  - Total hours estimated | 10h
  - Total hours spent | 6h 30m
- Technical Debt management:
  - Total hours estimated
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
  - Hours spent on remediation
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )

## ASSESSMENT

- What caused your errors in estimation (if any)? We underestimated some tasks, in particular the ones concerning the testing (using Jest). They turned out to be more difficult than we expected.

- What lessons did you learn (both positive and negative) in this sprint? Positive lesson: we are all aware of our skills and we have diffent skills so we learnt from each other.
  Negative lesson: we should pay more attention to the estimation time of the tasks.

- Which improvement goals set in the previous retrospective were you able to achieve?

- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Better management of YouTrack

- One thing you are proud of as a Team
  > the way we collaborate
