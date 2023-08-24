# school.io (NEXTJS FRONT END REFACTOR)

## Description
### Version 0.2.4
This is the beginning stages of a project intended to act as a simple website for teachers to create, update, and store important documentation.
The idea came from listening to my wife, who is a 3rd grade teacher.  According to her, the biggest annoyance is a teacher is keeping track of
documentation.  This can be as simple as writing down "I spoke with little Billy's parents at X time on Y date.  We spoke about this...".  This
documentation comes in handy when little Billy's mom calls the principal to complain.  Keeping that documentation is a way for the classroom teacher
to CYA, because without it, nobody else will.

It can also be as extensive as tracking specific student information over time, as required by a state's board of education.  The best case scenario
is that this documentation is never requested, and never needs to be used.  The worst case scenario is that the information is requested, but doesn't exist.

What makes all of this worse, is that the teacher must create all of this documentation on top of their already stressful job of teaching.
It takes up valuable time from the teacher, and often cuts into their own personal time that could be spent with family.

Essentially, I want this application to cut that down to an absolute minimum.

## Tech
The current iteration of this model is mostly to build a usable proof of concept using a standard MVC pattern.
Tech used:
- Javascript
- nodeJS/Express
- MongoDB with Mongoose
- EJS for the view template
- Bootstrap for styling

Once the model and controller portion is complete, the plan is to fully create the view within React/NextJS, and then in React Native.

## Status

### **UPDATE: 8-23-2023(1):**

- I took 3 days off of this.  When I came back I realized the scope of the
initial app was too much for a simple MVC.  I wanted to swap it to react anyway,
so here we are.

- I'm going to split the FE and BE into two repos, and work on them separately.

- The majority of this repo will be refactoring the FE that I have, managing local state, and making smart design choices.

- I'm also going to do it all in TS.


## Development Roadmap

[] **Organizational Tasks**
- [] Decide on UI Framework OR Create Custom UI utilities w/ Tailwind
- [] Choose color scheme.  Define light/dark modes.
- [] Brainstorm some kind of logo?

[] **Login/User Authentication(REFACTOR)**
- [] Login Page
- [] Account Creation Page
    - [] Org verification before signup.
- [] Basic Landing Page
- [] Account Email Verification
- [] User/Session Authentication

[] **Classroom/Student(REFACTOR)**
- [] Classes Page
- [] Class Instance Page
- [] Student Instance Page

[] **Documentation(PARTIAL REFACTOR)**
- [] Documentation creation page
    - [] Incident
    - [] Communication
    - [] PST
- [] Page for existing documentation instances
    - [] Incident
    - [] Communication
    - [] PST

[] **Utilities**
- [] Org Admin Page
    - [] Create classes
        - [] Assign a teacher or teachers to classes
        - [] Assign students to class (easier for Elementary)
    - [] Create students
        - [] Assign a class to students (easier for Middle/HS)
    - [] Transfer students between classes
    - [] Cross Org Student Transfer Requests
- [] Super Admin Page
    - [] Create Orgs
    - [] Create Org Admin Account
    - [] "Promote" Users to Org Admin
    - [] Data Utilities
- [] User profile
    - [] Profile Image
    - [] Editing of basic information
- [] Teacher to Teacher messaging within the same Org
