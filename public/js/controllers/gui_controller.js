var currentUser;

var selectionStatus = [
	'menu_about',
	'menu_od_matrices',
	'menu_stations_io',
	'menu_twitter'
];


function changeSelection(selected)
{
	for(each in selectionStatus)
	{
		var menu = selectionStatus[each];
		if(menu == selected)
		{
			if(!d3.select("#" + menu).classed("active"))
			{
				d3.select("#" + menu).classed("active", true);
			}
		}
		else
		{
			if(d3.select("#" + menu).classed("active"))
			{
				d3.select("#" + menu).classed("active", false);
			}
		}
		
	}
}

