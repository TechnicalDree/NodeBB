'use strict';
define('admin/dashboard/users', ['admin/modules/dashboard-line-graph', 'hooks'], (graph, hooks) => {
    const ACP = {};

    ACP.init = () => {
        graph.init({
            set: 'registrations',
            dataset: ajaxify.data.dataset,
        }).then(() => {
            hooks.onPage('action:admin.dashboard.updateGraph', ACP.updateTable);
        });
    };

    ACP.updateTable = async () => {
        if (!window.fetch) {
            return;
        }

        try {
            const response = await fetch(`${config.relative_path}/api${ajaxify.data.url}${window.location.search}`, { 
                credentials: 'include' 
            });

            if (!response.ok) {
                console.error('Failed to fetch user data:', response.status);
                return;
            }

            const payload = await response.json();
            const html = await parseAndTranslateTemplate(payload);
            updateTableContents(html);
        } catch (error) {
            console.error('Error updating table:', error);
        }
    };

    const parseAndTranslateTemplate = (payload) => {
        return new Promise((resolve, reject) => {
            app.parseAndTranslate(ajaxify.data.template.name, 'users', payload, (html) => {
                resolve(html);
            });
        });
    };

    const updateTableContents = (html) => {
        const tbodyEl = document.querySelector('.users-list tbody');
        tbodyEl.innerHTML = '';
        tbodyEl.append(...html.map((idx, el) => el));
        html.find('.timeago').timeago();
    };

    return ACP;
});





// 'use strict';

// define('admin/dashboard/users', ['admin/modules/dashboard-line-graph', 'hooks'], (graph, hooks) => {
// 	const ACP = {};

// 	ACP.init = () => {
// 		graph.init({
// 			set: 'registrations',
// 			dataset: ajaxify.data.dataset,
// 		}).then(() => {
// 			hooks.onPage('action:admin.dashboard.updateGraph', ACP.updateTable);
// 		});
// 	};

// 	ACP.updateTable = () => {
// 		if (window.fetch) {
// 			fetch(`${config.relative_path}/api${ajaxify.data.url}${window.location.search}`, { credentials: 'include' }).then((response) => {
// 				if (response.ok) {
// 					response.json().then(function (payload) {
// 						app.parseAndTranslate(ajaxify.data.template.name, 'users', payload, function (html) {
// 							const tbodyEl = document.querySelector('.users-list tbody');
// 							tbodyEl.innerHTML = '';
// 							tbodyEl.append(...html.map((idx, el) => el));

// 							html.find('.timeago').timeago();
// 						});
// 					});
// 				}
// 			});
// 		}
// 	};

// 	return ACP;
// });
