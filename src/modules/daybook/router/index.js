export default {
  name: "daybook",
  component: () =>
    import(
      /*ewebpackChunkName: "daybook"*/ "@/modules/daybook/layouts/DayBookLayout.vue"
    ),
  children: [
    {
      path: "",
      name: "no-entry",
      component: () =>
        import(
          /*ewebpackChunkName: "daybook-no-entry"*/ "@/modules/daybook/views/NoEntrySelected.vue"
        ),
    },
    {
      path: ":id",
      name: "entry",
      component: () =>
        import(
          /*ewebpackChunkName: "daybook-entry-vue"*/ "@/modules/daybook/views/EntryVue.vue"
        ),
      props: (route) => {
        return {
          id: route.params.id,
        };
      },
    },
  ],
};
