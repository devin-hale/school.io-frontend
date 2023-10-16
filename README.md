# school.io (NEXTJS FRONT END REFACTOR)

## Description
### Version 0.4.3
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
- Typescript
- nodeJS/Express
- MongoDB with Mongoose
- React/NextJS

## Status

### **CURRENTLY:**

**Logic**
- [ ] Organize state logic into get slices, and modify slices.
- [ ] Complete reducers for endpoints
    - [x] Students
    - [ ] Users
    - [ ] Classes
    - [ ] Orgs

**Orgs/ClassInstance Admin Page**
- [x] Display Classes, Teachers, Students
- [x] Add/Remove Teachers to/from class
- [x] Create class grid
- [x] Edit Class Info 
- [ ] Add/Remove Students to/from Class

**Students Admin Page**
- [x] Display org students
- [x] Create students
- [x] Edit Student Info
- [x] Delete Student
- [x] Add/Remove Students to/from Class

**Users Admin Page**
- [ ] Display all org users.
- [ ] Create user.
- [ ] Edit user info.
- [ ] Disable/Delete user.

