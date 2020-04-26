--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: plants; Type: TABLE; Schema: public; Owner: tpl619_2
--

CREATE TABLE public.plants (
    id integer NOT NULL,
    name text NOT NULL,
    species text NOT NULL,
    notes text,
    image text
);


ALTER TABLE public.plants OWNER TO tpl619_2;

--
-- Name: plants_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl619_2
--

CREATE SEQUENCE public.plants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.plants_id_seq OWNER TO tpl619_2;

--
-- Name: plants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl619_2
--

ALTER SEQUENCE public.plants_id_seq OWNED BY public.plants.id;


--
-- Name: task_instances; Type: TABLE; Schema: public; Owner: tpl619_2
--

CREATE TABLE public.task_instances (
    id integer NOT NULL,
    task_id integer,
    completed boolean DEFAULT false NOT NULL,
    due_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.task_instances OWNER TO tpl619_2;

--
-- Name: task_instances_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl619_2
--

CREATE SEQUENCE public.task_instances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_instances_id_seq OWNER TO tpl619_2;

--
-- Name: task_instances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl619_2
--

ALTER SEQUENCE public.task_instances_id_seq OWNED BY public.task_instances.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: tpl619_2
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    plant_id integer,
    description text NOT NULL,
    frequency integer NOT NULL
);


ALTER TABLE public.tasks OWNER TO tpl619_2;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl619_2
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO tpl619_2;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl619_2
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: plants id; Type: DEFAULT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.plants ALTER COLUMN id SET DEFAULT nextval('public.plants_id_seq'::regclass);


--
-- Name: task_instances id; Type: DEFAULT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.task_instances ALTER COLUMN id SET DEFAULT nextval('public.task_instances_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Data for Name: plants; Type: TABLE DATA; Schema: public; Owner: tpl619_2
--

COPY public.plants (id, name, species, notes, image) FROM stdin;
1	Planty	Air Plant	Taking care of Planty for Kim	\N
2	Planty 2	Green Onion	Tastes delicious	\N
\.


--
-- Data for Name: task_instances; Type: TABLE DATA; Schema: public; Owner: tpl619_2
--

COPY public.task_instances (id, task_id, completed, due_date) FROM stdin;
1	1	f	2020-04-25 19:27:57.245524
2	2	f	2020-04-25 19:27:57.245524
3	3	f	2020-04-25 19:27:57.245524
4	1	f	2020-04-28 19:27:57.245524
5	2	f	2020-05-02 19:27:57.245524
6	3	f	2020-04-27 19:27:57.245524
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: tpl619_2
--

COPY public.tasks (id, plant_id, description, frequency) FROM stdin;
1	1	Spray air plant	3
2	1	Soak air plant	7
3	2	Change water	2
4	1	Send update to Kim	14
\.


--
-- Name: plants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl619_2
--

SELECT pg_catalog.setval('public.plants_id_seq', 6, true);


--
-- Name: task_instances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl619_2
--

SELECT pg_catalog.setval('public.task_instances_id_seq', 6, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl619_2
--

SELECT pg_catalog.setval('public.tasks_id_seq', 4, true);


--
-- Name: plants plants_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_pkey PRIMARY KEY (id);


--
-- Name: task_instances task_instances_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.task_instances
    ADD CONSTRAINT task_instances_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: task_instances task_instances_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.task_instances
    ADD CONSTRAINT task_instances_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_plant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES public.plants(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

