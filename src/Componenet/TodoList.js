import { useRef, useState } from 'react';
import React from 'react';
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  SeeMore,
  PortalWrapper,
} from './TotoList.styled';
import { DAYS, MOCKAPPS } from '../consts';
import {
  datesAreOnSameDay,
  getDarkColor,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
} from '../utils';

export const TodoList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(MOCKAPPS);
  const dragDateRef = useRef();
  const dragindexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const [portalData, setPortalData] = useState({});
  const [colors, setColor] = useState('black');

  const goToPreviousWeek = () => {
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(previousWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const startOfCurrentWeek = new Date(currentDate);
  startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);

  const weekDates = [];
  let currentDatePointer = new Date(startOfCurrentWeek);

  while (currentDatePointer <= endOfCurrentWeek) {
    weekDates.push(currentDatePointer.getDate());
    currentDatePointer.setDate(currentDatePointer.getDate() + 1);
  }

  const addEvent = (date, event) => {
    if (!event.target.classList.contains('StyledEvent')) {
      const text = window.prompt('name');
      if (text) {
        date.setHours(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        setEvents((prev) => [...prev, { date, title: text, color: colors }]);
      }
    }
  };

  const drag = (index, e) => {
    dragindexRef.current = { index, target: e.target };
  };

  const onDragEnter = (date, e) => {
    e.preventDefault();
    dragDateRef.current = { date, target: e.target.id };
  };

  const drop = (ev) => {
    ev.preventDefault();

    setEvents((prev) =>
      prev.map((ev, index) => {
        if (index === dragindexRef.current.index) {
          ev.date = dragDateRef.current.date;
        }
        return ev;
      })
    );
  };

  const handleOnClickEvent = (event) => {
    setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => setShowPortal(false);

  const handleDelete = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((ev) => ev.title !== portalData.title)
    );
    handlePotalClose();
  };

  const handleComplete = () => {
    setColor('green');
    handlePotalClose();
  };

  return (
    <Wrapper>
      <h3>Todo-List</h3>
      <DateControls>
        <button onClick={goToPreviousWeek} name="arrow-back-circle-outline">
          prev
        </button>
        {getMonthYear(currentDate)}
        <button onClick={goToNextWeek} name="arrow-forward-circle-outline">
          next
        </button>
      </DateControls>
      <SevenColGrid>
        {DAYS.map((day) => (
          <HeadDays className="nonDRAG">{day}</HeadDays>
        ))}
        {weekDates.map((day) => (
          <h1 className="day">{day}</h1>
        ))}
      </SevenColGrid>

      <SevenColGrid
        fullheight={true}
        is28Days={getDaysInMonth(currentDate) === 28}
      >
        {getSortedDays(currentDate).map((day) => (
          <div
            id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
            onDragEnter={(e) =>
              onDragEnter(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                ),
                e
              )
            }
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={drop}
          >
            <button
              className="btn"
              onClick={(e) =>
                addEvent(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  ),
                  e
                )
              }
            >
              add
            </button>
            {/* <span
              className={`nonDRAG ${
                datesAreOnSameDay(
                  new Date(),
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                )
                  ? 'active'
                  : ''
              }`}
            ></span> */}
            <EventWrapper>
              {events.map(
                (ev, index) =>
                  datesAreOnSameDay(
                    ev.date,
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  ) && (
                    <StyledEvent
                      onDragStart={(e) => drag(index, e)}
                      onClick={() => handleOnClickEvent(ev)}
                      draggable
                      className="StyledEvent"
                      id={`${ev.color} ${ev.title}`}
                      key={ev.title}
                      bgColor={ev.color}
                    >
                      {ev.title}
                    </StyledEvent>
                  )
              )}
            </EventWrapper>
          </div>
        ))}
      </SevenColGrid>
      {showPortal && (
        <Portal
          {...portalData}
          handleDelete={handleDelete}
          handlePotalClose={handlePotalClose}
          handleComplete={handleComplete}
        />
      )}
    </Wrapper>
  );
};

const EventWrapper = ({ children }) => {
  if (children.filter((child) => child).length)
    return (
      <>
        {children}
        {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              console.log('clicked p');
            }}
          >
            see more...
          </SeeMore>
        )}
      </>
    );
};

const Portal = ({
  title,
  date,
  handleDelete,
  handlePotalClose,
  handleComplete,
}) => {
  return (
    <PortalWrapper>
      <h2>{title}</h2>
      <button onClick={handleDelete} name="trash-outline">
        🚮
      </button>
      <button onClick={handleComplete} name="trash-outline">
        ✅
      </button>
      <button onClick={handlePotalClose} name="close-outline">
        ❌
      </button>
    </PortalWrapper>
  );
};
