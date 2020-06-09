# Intents



### ` request_accessibility_info`

_Examples:_ 
- I want to know if `place` in `location` is accessible
- I want to know accessible places in `location`
- Accessible places in `location`
- Accessible spots in my area.

_Entities:_  
- `place` (e.g. The Museum of Modern Art)
- `location` (e.g. Chicago)

<hr/>

### ` provide_address` 

_Examples:_
- I am at `address`
- I'm close to `address`
- I'm standing at `address`
- My location is `address`

_Entities:_
- `address`: (e.g. 123 Broadway Ave.)

<hr/>

### `choosing_item` 
This one in specific is for blind people that cannot see the buttons and need to make a selection based on the order the information was given.

_Examples:_
- The `ordinal` one
- Number `cardinal` please
- The option number `cardinal`

_Entities:_
- `ordinal`: first | second | third | etc.
- `cardinal`: one | two | three | etc.

<hr/>

### `request_direction` 

_Examples:_
- What is the best way to `destination`
- How can I go to `destination`
- What is the shortest way to `destination`
- Take me to `destination`

_Entities:_
- `destination`: address or aprox location

<hr/>

### `request_amenities_by_disability` 


_Examples:_
- Does this place is accessible for `disability`
- If I am `disability`, can I use the facilities
- Are the facilities prepared to receive someone `disability`?


_Entities:_
- `disability`: blind | hard to hear | wheelchair

<hr/>


### `request_photos` 

_Examples:_
- Can I see photos of the place 
- Can you show me some pics
- Can I see the place

<hr/>

### `asking_question` 
(not sure how to handle this one, we just need to detect an incoming question, and save to be answered later.)

_Examples:_
- What is X
- Where is Y
- Is this Z

<hr/>






