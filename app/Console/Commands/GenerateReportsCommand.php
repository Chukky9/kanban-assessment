<?php

namespace App\Console\Commands;

use App\Jobs\GenerateReportJob;
use Illuminate\Console\Command;

class GenerateReportsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate reports for all projects';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Dispatching report generation job...');
        
        GenerateReportJob::dispatch();
        
        $this->info('Report generation job dispatched successfully!');
        
        return Command::SUCCESS;
    }
}
